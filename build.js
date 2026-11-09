#!/usr/bin/env node
// build.js: regenerates themes/*.json from vendor/tokyo-night-color-theme.json + palette.js.
//
//   node build.js
//
// Only colors change: every UI key, token rule, scope and font style of Tokyo Night is kept.
// The build REFUSES to write if any check fails:
//   1. every Tokyo color is mapped (nothing silently stays blue)
//   2. no blue remains (hue 175-255 with saturation > 15%)
//   3. code colors are readable on the editor background (4.5:1; comments 3:1)
//   4. key UI text/background pairs are readable
//   5. structure is identical to Tokyo Night (same keys, same token rules in the same order)
// It also rewrites package.json's theme list to match palette.variants and writes
// build-report.txt (every old -> new mapping).

const fs = require('fs');
const path = require('path');
const P = require('./palette');

const ROOT = __dirname;
const TEMPLATE = path.join(ROOT, 'vendor', 'tokyo-night-color-theme.json');
const THEMES = path.join(ROOT, 'themes');
const PKG = path.join(ROOT, 'package.json');
const REPORT = path.join(ROOT, 'build-report.txt');

// ---------- JSONC ----------
function stripJsonc(s) {
  let out = '', i = 0, inStr = false;
  while (i < s.length) {
    const c = s[i], n = s[i + 1];
    if (inStr) {
      out += c;
      if (c === '\\') { out += n; i += 2; continue; }
      if (c === '"') inStr = false;
      i++; continue;
    }
    if (c === '"') { inStr = true; out += c; i++; continue; }
    if (c === '/' && n === '/') { while (i < s.length && s[i] !== '\n') i++; continue; }
    if (c === '/' && n === '*') { i += 2; while (i < s.length && !(s[i] === '*' && s[i + 1] === '/')) i++; i += 2; continue; }
    out += c; i++;
  }
  return out.replace(/,(\s*[}\]])/g, '$1');
}

// ---------- color math ----------
const HEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
function split(hex) { // -> { base: '#rrggbb', alpha: '' | 'aa' }
  let h = hex.toLowerCase();
  if (h.length === 4 || h.length === 5) h = '#' + [...h.slice(1)].map(x => x + x).join('');
  return { base: h.slice(0, 7), alpha: h.length === 9 ? h.slice(7) : '' };
}
const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
function hsl(hex) {
  const [r, g, b] = rgb(hex).map(v => v / 255);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  let h = 0, s = 0;
  if (mx !== mn) {
    const d = mx - mn;
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}
function fromHsl(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return '#' + [f(0), f(8), f(4)].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
}
function lum(hex) {
  const [r, g, b] = rgb(hex).map(v => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
function over(hex, bg) { // composite a possibly-translucent color over an opaque bg
  const { base, alpha } = split(hex);
  if (!alpha) return base;
  const a = parseInt(alpha, 16) / 255, f = rgb(base), g = rgb(bg);
  return '#' + f.map((v, i) => Math.round(v * a + g[i] * (1 - a)).toString(16).padStart(2, '0')).join('');
}
const isBlue = hex => { const c = hsl(hex); return c.h >= 175 && c.h <= 255 && c.s > 15; };

// Tokyo's blue-grays (and true grays) -> the site's cool gray, by lightness.
function neutral(base) {
  const c = hsl(base);
  const blueGray = c.h >= 200 && c.h <= 250 && c.s < 45;
  if (!(c.s < 20 || blueGray)) return null;
  const r = P.neutralRamp;
  let L = c.l;
  for (let i = 1; i < r.length; i++) {
    if (c.l <= r[i][0]) { const [x0, y0] = r[i - 1], [x1, y1] = r[i]; L = y0 + (y1 - y0) * (c.l - x0) / (x1 - x0); break; }
  }
  return fromHsl(P.neutralTint.hue, P.neutralTint.sat, L);
}

// ---------- mapping ----------
function withAlpha(newBase, srcAlpha) {
  const n = split(newBase);
  return n.base + (n.alpha || srcAlpha);
}

function mapUi(key, value, log, errors) {
  if (typeof value !== 'string' || !HEX.test(value)) return value;
  const { base, alpha } = split(value);
  let out, how;
  if (key in P.uiKeyOverrides) {
    const o = P.uiKeyOverrides[key];
    out = o.length === 9 ? o.toLowerCase() : withAlpha(o, alpha); how = 'key';
  } else if (base === P.borderSource && P.borderKeyPattern.test(key)) {
    out = withAlpha(P.site.border, alpha); how = 'border';
  } else if (base in P.uiHexMap) {
    out = withAlpha(P.uiHexMap[base], alpha); how = 'map';
  } else {
    const g = neutral(base);
    if (g) { out = withAlpha(g, alpha); how = 'auto'; }
  }
  if (!out) { errors.push(`unmapped UI color ${value} on "${key}"`); return value; }
  log.push({ kind: 'ui', where: key, from: value.toLowerCase(), to: out, how });
  return out;
}

function resolveRole(role, roles) {
  if (role.startsWith('#')) return role.toLowerCase();
  if (!(role in roles)) throw new Error(`palette.js: unknown role "${role}"`);
  return roles[role].toLowerCase();
}

function mapCode(where, ruleName, value, roles, log, errors) {
  if (typeof value !== 'string' || !HEX.test(value)) return value;
  const { base, alpha } = split(value);
  let out, how, role;
  if (ruleName && ruleName in P.codeRuleOverrides) { role = P.codeRuleOverrides[ruleName]; how = 'rule'; }
  else if (base in P.codeHexRoles) { role = P.codeHexRoles[base]; how = 'role'; }
  if (role) out = withAlpha(resolveRole(role, roles), alpha);
  else { const g = neutral(base); if (g) { out = withAlpha(g, alpha); how = 'auto'; role = 'neutral'; } }
  if (!out) { errors.push(`unmapped code color ${value} on ${where}`); return value; }
  log.push({ kind: 'code', where, from: value.toLowerCase(), to: out, how, role });
  return out;
}

// ---------- build one variant ----------
function buildVariant(template, variant) {
  const t = JSON.parse(JSON.stringify(template));
  const roles = { ...P.codeRoles, ...variant };
  const log = [], errors = [];

  t.name = variant.label;
  t.author = 'Hunter Delaney (palette); structure from Tokyo Night by enkia (MIT)';
  delete t.maintainers;

  for (const k of Object.keys(t.colors)) t.colors[k] = mapUi(k, t.colors[k], log, errors);
  for (const k of Object.keys(P.uiKeyOverrides)) {
    if (!(k in t.colors)) { t.colors[k] = P.uiKeyOverrides[k].toLowerCase(); log.push({ kind: 'ui', where: k, from: '(added)', to: t.colors[k], how: 'add' }); }
  }
  t.tokenColors.forEach((r, i) => {
    for (const p of ['foreground', 'background']) {
      if (r.settings && r.settings[p]) r.settings[p] = mapCode(`rule ${i} "${r.name}" ${p}`, r.name, r.settings[p], roles, log, errors);
    }
  });
  for (const [k, v] of Object.entries(t.semanticTokenColors || {})) {
    if (typeof v === 'string') t.semanticTokenColors[k] = mapCode(`semantic "${k}"`, null, v, roles, log, errors);
    else if (v && v.foreground) v.foreground = mapCode(`semantic "${k}"`, null, v.foreground, roles, log, errors);
  }
  return { theme: t, log, errors: [...errors, ...check(template, t, log)] };
}

// ---------- checks ----------
function check(template, t, log) {
  const errs = [];
  const editorBg = split(t.colors['editor.background']).base;

  // 2. no blue anywhere in the output
  for (const e of log) if (isBlue(split(e.to).base)) errs.push(`blue survives: ${e.to} on ${e.where} (from ${e.from})`);

  // 3. code readability on the editor background
  for (const e of log.filter(x => x.kind === 'code' && x.where.endsWith('foreground') || x.kind === 'code' && x.where.startsWith('semantic'))) {
    const dimOk = /comment|separator|blockquote|punctuation|heading 6/i.test(e.where);
    const min = dimOk ? 3 : 4.5;
    const c = contrast(over(e.to, editorBg), editorBg);
    if (c < min) errs.push(`low contrast ${c.toFixed(2)}:1 (< ${min}) for ${e.to} on ${e.where}`);
  }

  // 4. key UI pairs
  const pairs = [
    ['editor.foreground', 'editor.background', 4.5],
    ['sideBar.foreground', 'sideBar.background', 4.5],
    ['statusBar.foreground', 'statusBar.background', 4.5],
    ['tab.activeForeground', 'tab.activeBackground', 4.5],
    ['tab.inactiveForeground', 'tab.inactiveBackground', 3],
    ['button.foreground', 'button.background', 4.5],
    ['button.foreground', 'button.hoverBackground', 4.5],
    ['activityBarBadge.foreground', 'activityBarBadge.background', 4.5],
    ['list.activeSelectionForeground', 'list.activeSelectionBackground', 4.5],
    ['editorLineNumber.activeForeground', 'editor.background', 3],
    ['editorError.foreground', 'editor.background', 3],
    ['editorWarning.foreground', 'editor.background', 3],
    ['terminal.foreground', 'terminal.background', 4.5],
    ...['Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan', 'White'].map(c => [`terminal.ansi${c}`, 'terminal.background', 4.5]),
  ];
  for (const [fg, bg, min] of pairs) {
    if (!t.colors[fg] || !t.colors[bg]) { errs.push(`missing UI key for contrast pair ${fg} / ${bg}`); continue; }
    const b = over(t.colors[bg], editorBg), f = over(t.colors[fg], b), c = contrast(f, b);
    if (c < min) errs.push(`low UI contrast ${c.toFixed(2)}:1 (< ${min}): ${fg} ${t.colors[fg]} on ${bg} ${t.colors[bg]}`);
  }

  // 5. structure: same keys and token rules as Tokyo Night (only colors may differ)
  for (const k of Object.keys(template.colors)) if (!(k in t.colors)) errs.push(`UI key dropped: ${k}`);
  const extra = Object.keys(t.colors).filter(k => !(k in template.colors) && !(k in P.uiKeyOverrides));
  if (extra.length) errs.push(`unexpected UI keys: ${extra.join(', ')}`);
  if (template.tokenColors.length !== t.tokenColors.length) errs.push('token rule count changed');
  template.tokenColors.forEach((r, i) => {
    const o = t.tokenColors[i];
    if (!o || o.name !== r.name || JSON.stringify(o.scope) !== JSON.stringify(r.scope) ||
        (o.settings || {}).fontStyle !== (r.settings || {}).fontStyle) errs.push(`token rule ${i} "${r.name}" changed shape`);
  });
  if (JSON.stringify(Object.keys(template.semanticTokenColors || {})) !== JSON.stringify(Object.keys(t.semanticTokenColors || {})))
    errs.push('semanticTokenColors keys changed');
  if (template.semanticHighlighting !== t.semanticHighlighting) errs.push('semanticHighlighting changed');
  return errs;
}

// ---------- main ----------
function main() {
  const template = JSON.parse(stripJsonc(fs.readFileSync(TEMPLATE, 'utf8')));
  const ids = P.variants.map(v => v.id);
  if (new Set(ids).size !== ids.length) { console.error('palette.js: duplicate variant ids'); process.exit(1); }

  const fileFor = v => `cherry-blossom${v.id ? '-' + v.id : ''}-color-theme.json`;
  const results = P.variants.map(v => ({ v, file: fileFor(v), ...buildVariant(template, v) }));

  const failed = results.filter(r => r.errors.length);
  if (failed.length) {
    for (const r of failed) {
      console.error(`\n✗ ${r.v.label}: ${r.errors.length} problem(s)`);
      for (const e of r.errors.slice(0, 40)) console.error('   - ' + e);
      if (r.errors.length > 40) console.error(`   ... and ${r.errors.length - 40} more`);
    }
    console.error('\nNothing written.');
    process.exit(1);
  }

  // write themes, remove stale generated ones
  fs.mkdirSync(THEMES, { recursive: true });
  const header = '// GENERATED by build.js from palette.js + vendor/tokyo-night-color-theme.json. Do not edit by hand.\n';
  for (const r of results) {
    const json = JSON.stringify(r.theme, null, 2);
    JSON.parse(json); // valid JSON
    fs.writeFileSync(path.join(THEMES, r.file), header + json + '\n');
  }
  const keep = new Set(results.map(r => r.file));
  for (const f of fs.readdirSync(THEMES)) {
    if (/^cherry-blossom.*-color-theme\.json$/.test(f) && !keep.has(f)) { fs.unlinkSync(path.join(THEMES, f)); console.log(`removed stale ${f}`); }
  }

  // package.json theme list follows palette.variants
  const pkg = JSON.parse(fs.readFileSync(PKG, 'utf8'));
  const themes = results.map(r => ({ label: r.v.label, uiTheme: 'vs-dark', path: `./themes/${r.file}` }));
  if (JSON.stringify(pkg.contributes.themes) !== JSON.stringify(themes)) {
    pkg.contributes.themes = themes;
    fs.writeFileSync(PKG, JSON.stringify(pkg, null, 2) + '\n');
    console.log('updated package.json theme list');
  }

  // report
  const lines = [];
  for (const r of results) {
    lines.push(`=== ${r.v.label} (${r.file}) ===`, '');
    for (const kind of ['ui', 'code']) {
      const groups = new Map();
      for (const e of r.log.filter(x => x.kind === kind)) {
        const k = `${e.from} -> ${e.to}  [${e.how}${e.role ? ':' + e.role : ''}]`;
        if (!groups.has(k)) groups.set(k, []);
        groups.get(k).push(e.where);
      }
      lines.push(`--- ${kind.toUpperCase()} (${groups.size} distinct mappings) ---`);
      for (const [k, w] of [...groups].sort()) lines.push(`${k.padEnd(48)} x${String(w.length).padEnd(3)} ${w.slice(0, 4).join(' | ')}${w.length > 4 ? ' | ...' : ''}`);
      lines.push('');
    }
  }
  fs.writeFileSync(REPORT, lines.join('\n'));

  for (const r of results) {
    const n = r.log.length, auto = r.log.filter(e => e.how === 'auto').length;
    console.log(`✓ ${r.v.label}: ${n} colors mapped (${auto} grays by lightness), all checks passed -> themes/${r.file}`);
  }
  console.log('report: build-report.txt');
}

main();

// palette.js: the DARK theme's palette (palette-light.js holds the light theme).
// Edit a hex here, run `node build.js`, and the generated themes/*.json update.
//
// Site colors are copied verbatim from cassie7511.github.io/style.css.
// Structure (which code scopes and UI parts get color) comes from a base theme
// (vendor/base-dark.json, MIT): build.js recolors it through the maps below.

// Mix a color toward the editor background: dim('#ffffff', 0.25) is 25% of the way to the bg.
function dim(hex, k) {
  const a = hex.match(/\w\w/g).map(h => parseInt(h, 16));
  const b = '17171a'.match(/\w\w/g).map(h => parseInt(h, 16));
  return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * k).toString(16).padStart(2, '0')).join('');
}

const site = {
  bg:      '#0d0d0f', // near-black: sidebar, activity bar, tabs, status bar, panel, title bar
  surface: '#17171a', // editor background (the code sits in a "card", like the site's project cards)
  border:  '#2a2a2f', // dividers between areas, widget borders
  text:    '#c9c9cf', // main gray text
  muted:   '#8a8a92', // dimmer gray
  white:   '#ffffff', // headings on the site
  pink:    '#f6b3c5', // cherry blossom
  pinkDim: '#d98ba1', // darker pink (hovers on the site)
};

// Soft companions: pastels near the pink's lightness. None of them blue.
const soft = {
  sage:     '#b6cfa6', // strings
  peach:    '#f3c7a5', // numbers, constants
  lavender: '#c3a9ec', // classes, built-ins, imports, properties. Violet enough to tell from the pink, not blue
  butter:   '#e8d3a0', // function parameters (the template's warm yellow role)
  mint:     '#a8d8c0', // regex, terminal "cyan"
  amber:    '#e6b673', // warnings, terminal "yellow"
  red:      '#f05a64', // errors: deeper and more saturated than the pink so it never reads as a highlight
};

const dims = {
  lavenderDim: dim(soft.lavender, 0.25),
  sageDim:     dim(soft.sage, 0.25),
  peachDim:    dim(soft.peach, 0.25),
  mintDim:     dim(soft.mint, 0.25),
  amberDim:    dim(soft.amber, 0.25),
  pinkDeep:    dim(site.pinkDim, 0.2),
};

// ---------------------------------------------------------------------------------------------
// CODE: named roles. The template's code colors are mapped onto these (codeHexRoles below).
// ---------------------------------------------------------------------------------------------
const codeRoles = {
  text:         site.text,   // untokenized text (editor.foreground)
  variable:     '#d6d6db',   // variables: a touch brighter than plain text, as in the template
  textDim:      '#aeaeb5',   // HTML text, color literals
  comment:      '#6e6e76',   // italic (the template's italics are kept)
  commentDoc:   '#7a7a82',
  commentDocEm: '#86868e',
  string:       soft.sage,
  number:       soft.peach,
  param:        soft.butter, // function parameters
  accent2:      site.pinkDim, // the template's red: HTML tags, this/self, spread, CSS units
  objectKey:    '#dcdce1',   // object-literal keys (the template's teal)
  operator:     site.muted,
  punctuation:  site.muted,
  tagPunct:     '#77777f',   // the < > around HTML tags
  regex:        soft.mint,
  invalid:      soft.red,
  inserted:     soft.sage,
  deleted:      '#d0666f',
  changed:      soft.lavender,
  warn:         soft.amber,
  error:        soft.red,
  debug:        soft.lavender,
  pink:         site.pink,
  pinkDim:      site.pinkDim,
  peach:        soft.peach,
  muted:        site.muted,
};

// The final dark theme: pink on function names (chosen over pink keywords, 2026-11-08).
// build.js rewrites package.json's theme list from the variants of every palette file.
const variants = [
  {
    id: '',
    label: 'Night Sakura',
    keyword: soft.lavender,       // if, def, return, class, const...
    keywordMod: dims.lavenderDim, // var / let / const, storage modifiers
    func: site.pink,              // function and method names
    support: '#ececf0',           // classes, built-ins, imports, properties
  },
];

// Template code hex -> role name (or a literal hex).
const codeHexRoles = {
  '#51597d': 'comment', '#5a638c': 'commentDoc', '#646e9c': 'commentDocEm', '#4e5579': 'comment',
  '#ff9e64': 'number',
  '#9ece6a': 'string',
  '#9aa5ce': 'textDim', '#c0cefc': 'text', '#747ca1': 'muted',
  '#ff5370': 'invalid',
  '#bb9af7': 'keyword',
  '#9d7cd8': 'keywordMod',
  '#7dcfff': 'support', '#0db9d7': 'support', '#2ac3de': 'support', '#41a6b5': 'support',
  '#f7768e': 'accent2', '#de5971': 'accent2', '#fc7b7b': 'accent2',
  '#ba3c97': 'tagPunct',
  '#89ddff': 'operator', '#9abdf5': 'punctuation',
  '#61bdf2': 'support', '#6d91de': 'func',
  '#e0af68': 'param',
  '#c0caf5': 'variable',
  '#73daca': 'objectKey',
  '#7aa2f7': 'func',
  '#449dab': 'inserted', '#914c54': 'deleted', '#6183bb': 'changed',
  '#b4f9f8': 'regex',
  '#ffdb69': 'warn', '#db4b4b': 'error', '#b267e6': 'debug',
  '#d9d4cd': '#d9d4cd', // the template's warm off-white for parameter usages (semantic): already not blue, kept
};

// Specific template token rules (by their "name") that need a different role than their hex implies.
const codeRuleOverrides = {
  'Markdown - Heading 1': 'pink',
  'Markdown - Heading 2': 'pink',
  'Markdown - Heading 3': 'pinkDim',
  'Markdown - Heading 4': 'pinkDim',
  'Markdown - Heading 5': 'text',
  'Markdown - Heading 6': 'muted',
  'Markdown - Link': 'pink',
  'Markdown - Markup Raw Inline': 'peach',
  'Markdown - Fenced Code Block': 'muted',
  'Escape Characters': 'peach',      // \n inside a sage string should stand out
  'HTML Attributes': 'support',      // tags are pink-dim; keyword-pink attributes made HTML all pink
  'JSON Key - Level 8': 'objectKey', // would otherwise share the string color
};

// ---------------------------------------------------------------------------------------------
// UI: template workbench hex -> new hex. The template's alpha (e.g. #3d59a1dd) is kept.
// Any template blue-gray NOT listed here is converted automatically by lightness (see neutralRamp).
// ---------------------------------------------------------------------------------------------
const uiHexMap = {
  // structure
  '#16161e': site.bg,      // chrome
  '#1a1b26': site.surface, // editor
  '#a9b1d6': site.text,    // main UI text
  '#787c99': site.muted,   // secondary UI text
  '#c0caf5': site.text,
  '#c0cefc': site.text,
  '#ffffff': site.white,
  '#000000': '#000000',
  // The template's UI accent blue -> pink: active tab marker, badges, progress bar, find matches, links
  '#3d59a1': site.pink, '#6183bb': site.pink, '#668ac4': site.pink,
  '#29355a': site.pinkDim, // sash hover, focused notebook cell
  '#bb9af7': site.pink,    // overview-ruler word highlights, terminal magenta
  // other blues / cyans / purples -> lavender (info, hints, git "modified", charts.blue)
  '#7aa2f7': soft.lavender, '#7dcfff': soft.lavender, '#89ddff': soft.lavender, '#68b3de': soft.lavender,
  '#61bdf2': soft.lavender, '#698cd6': soft.lavender, '#6d91de': soft.lavender, '#506fca': soft.lavender,
  '#0da0ba': soft.lavender, '#0db9d7': soft.lavender, '#25aac2': soft.lavender, '#2ac3de': soft.lavender,
  '#1abc9c': soft.lavender, '#9d7cd8': soft.lavender, '#9a7ecc': soft.lavender, '#b267e6': soft.lavender,
  '#394b70': '#5a4a6e', '#425882': '#6a5884', // gutter "modified" marks
  // teals / greens -> sage ("added")
  '#41a6b5': soft.sage, '#449dab': soft.sage, '#73daca': soft.sage, '#9ece6a': soft.sage,
  '#80a856': dims.sageDim,
  '#164846': '#2f3d2a', '#1c5957': '#3a4a33', '#007a75': '#5f7a52', // gutter / merge "added" tints
  '#b4f9f8': soft.mint,
  // yellows -> amber (warnings), oranges -> peach
  '#e0af68': soft.amber, '#bba461': soft.amber, '#e2bd3a': soft.amber, '#ffdb69': soft.amber,
  '#c49a5a': dims.amberDim, '#c2985b': dims.amberDim,
  '#ff9e64': soft.peach, '#c97018': dims.peachDim,
  // reds -> red. The template's darker reds are already warm, not blue: kept as they are
  '#db4b4b': soft.red, '#ff5370': soft.red, '#f7768e': soft.red, '#fc7b7b': site.pinkDim,
  '#c24242': '#c24242', '#85353e': '#85353e', '#963c47': '#963c47', '#914c54': '#914c54',
  '#bb616b': '#bb616b', '#a6333f': '#a6333f', '#703438': '#703438', '#823c41': '#823c41',
  '#944449': '#944449', '#de5971': '#de5971', '#ba3c97': '#ba3c97',
  '#d9d4cd': '#d9d4cd',
};

// Individual UI keys that need a specific color. A 7-char hex keeps the template's alpha; 9-char replaces it.
// Keys the template doesn't define are added.
const uiKeyOverrides = {
  'editorCursor.foreground': site.pink,
  'terminalCursor.foreground': site.pink,
  'activityBar.activeBorder': site.pink,
  'list.activeSelectionForeground': site.pink, // like the site's .sideitem.active
  // Claude Code permission modes (2026-11-08): auto mode is drawn in VS Code's errorForeground,
  // plan mode in button.background (+ focusBorder for its input outline). Auto = pink, plan = violet.
  'errorForeground': site.pink,      // auto mode; also VS Code / Claude panel error text
  'focusBorder': soft.lavender + '55', // plan mode's input outline; focus outlines everywhere
  'textLink.activeForeground': site.pinkDim,   // the site's link hover

  // buttons: violet with near-black text (also Claude Code's plan mode); badges stay pink.
  // Solid ('ff'): the template's buttons are translucent, which would make the hover darker than the button.
  'button.background': soft.lavender + 'ff',
  'button.hoverBackground': '#d2bef1ff',
  'button.foreground': site.bg,
  'extensionButton.prominentBackground': soft.lavender + 'ff',
  'extensionButton.prominentHoverBackground': '#d2bef1ff',
  'extensionButton.prominentForeground': site.bg,
  'activityBarBadge.foreground': site.bg,
  'extensionBadge.remoteForeground': site.bg,
  'chat.avatarForeground': site.bg,
  'chat.slashCommandForeground': site.pink,

  // find: current match pink with a pink border, other matches fainter
  'editor.findMatchBorder': site.pink,
  'editor.findMatchHighlightBackground': site.pink + '33',

  // git "modified" stays a quiet lavender in the explorer, not pink
  'gitDecoration.modifiedResourceForeground': soft.lavender,
  'gitDecoration.stageModifiedResourceForeground': soft.lavender,
  'inputValidation.infoBackground': soft.lavender + '33',
  'inputValidation.infoBorder': soft.lavender,
  'merge.incomingHeaderBackground': soft.lavender + '55',
  'merge.incomingContentBackground': soft.lavender + '22',

  // bracket-pair colorization: six muted palette colors
  'editorBracketHighlight.foreground1': site.pinkDim,
  'editorBracketHighlight.foreground2': dims.lavenderDim,
  'editorBracketHighlight.foreground3': dims.sageDim,
  'editorBracketHighlight.foreground4': dims.peachDim,
  'editorBracketHighlight.foreground5': dims.mintDim,
  'editorBracketHighlight.foreground6': dims.amberDim,
  'editorBracketPairGuide.activeBackground1': site.pinkDim,
  'editorBracketPairGuide.activeBackground2': dims.lavenderDim,
  'editorBracketPairGuide.activeBackground3': dims.sageDim,
  'editorBracketPairGuide.activeBackground4': dims.peachDim,
  'editorBracketPairGuide.activeBackground5': dims.mintDim,
  'editorBracketPairGuide.activeBackground6': dims.amberDim,

  // terminal: blue -> lavender, cyan -> mint, so blue output still stands out without any blue
  'terminal.ansiRed': soft.red,          'terminal.ansiBrightRed': soft.red,
  'terminal.ansiGreen': soft.sage,       'terminal.ansiBrightGreen': soft.sage,
  'terminal.ansiYellow': soft.amber,     'terminal.ansiBrightYellow': soft.amber,
  'terminal.ansiBlue': soft.lavender,    'terminal.ansiBrightBlue': soft.lavender,
  'terminal.ansiMagenta': site.pink,     'terminal.ansiBrightMagenta': site.pink,
  'terminal.ansiCyan': soft.mint,        'terminal.ansiBrightCyan': soft.mint,
  'terminal.ansiWhite': site.text,       'terminal.ansiBrightWhite': site.white,
};

// ---------------------------------------------------------------------------------------------
// PINK HIGHLIGHTS (chosen 2026-11-08): wherever the template puts a blue highlight, this puts pink.
// Buttons stay violet: Claude Code draws plan mode in button.background.
// ---------------------------------------------------------------------------------------------
// Highlights the template tints blue-gray: they keep the gray ramp's lightness but take a pink tint at
// the template's own strength (build.js `blush`). palette-light.js reuses this list.
const blushKeys = [
  'selection.background', 'editor.selectionBackground', 'editor.inactiveSelectionBackground',
  'editor.selectionHighlightBackground', 'editor.wordHighlightBackground', 'editor.wordHighlightStrongBackground',
  'editor.findRangeHighlightBackground', 'editor.rangeHighlightBackground', 'terminal.selectionBackground',
  'editor.lineHighlightBackground', 'editorIndentGuide.activeBackground1',
  'list.activeSelectionBackground', 'list.inactiveSelectionBackground', 'list.focusBackground',
  'list.dropBackground', 'sideBar.dropBackground', 'editorGroup.dropBackground',
  'editorSuggestWidget.selectedBackground', 'menu.selectionBackground', 'menubar.selectionBackground',
  'toolbar.hoverBackground', 'toolbar.activeBackground', 'statusBarItem.hoverBackground',
  'scrollbarSlider.background', 'scrollbarSlider.hoverBackground', 'scrollbarSlider.activeBackground',
  'badge.background',
];
const blush = { hue: 344, satScale: 1, keys: blushKeys }; // 344 = the site pink's hue
const pinkHighlights = {
  // Claude Code panel (and the same spots in VS Code)
  'textPreformat.foreground': site.pink,           // `inline code` in replies, hovers, markdown preview
  'textPreformat.background': site.pink + '1a',
  'chat.slashCommandBackground': site.pink + '22', // @-mention chips (text is already pink)
  'badge.foreground': site.pink,
  'menu.selectionForeground': site.pink,
  'menubar.selectionForeground': site.pink,
  'inputOption.activeBorder': site.pink,           // focused permission / question dialogs, search boxes
  'list.hoverBackground': '#1a1215', // set by hand: converted, it lands 1 shade off the sidebar
  'editorLineNumber.activeForeground': site.pinkDim,
  // VS Code defaults that are blue and that the template never sets
  'textBlockQuote.border': site.pinkDim,
  'editor.hoverHighlightBackground': site.pink + '1a',
  'chat.requestCodeBorder': site.pink + '55',
  'chat.workingProgressStableIconForeground': site.pink,
  'chart.line': site.pink,
  'terminalCommandDecoration.successBackground': soft.sage,
  'debugTokenExpression.type': soft.lavender,
  ...Object.fromEntries(['variable', 'field', 'interface', 'enumeratorMember']
    .map(s => [`symbolIcon.${s}Foreground`, soft.lavender])),
  ...Object.fromEntries(['pause', 'stepOver', 'stepInto', 'stepOut', 'continue', 'stepBack']
    .map(s => [`debugIcon.${s}Foreground`, soft.lavender])),
};

// The template's #101014 is both its border color and a few dark backgrounds. On keys that are borders
// it becomes the site's border color; elsewhere it is converted by lightness like other neutrals.
const borderSource = '#101014';
const borderKeyPattern = /border$|^editorRuler\.foreground$|^menu\.separatorBackground$/i;

// Neutral conversion: template HSL lightness -> new lightness (piecewise linear), then a gray with
// the site's slight cool tint (hue 240, saturation 5%).
const neutralRamp = [
  [0, 0], [7, 4], [10, 5.5], [13, 9.6], [15, 12.5], [27, 24], [41, 38],
  [54, 55.7], [75, 80], [86, 85], [100, 100],
];
const neutralTint = { hue: 240, sat: 5 };

module.exports = {
  template: 'base-dark.json', // in vendor/
  filePrefix: 'cherry-blossom',
  uiTheme: 'vs-dark',
  type: 'dark',
  site, soft, dims, codeRoles, variants, codeHexRoles, codeRuleOverrides,
  uiHexMap, uiKeyOverrides: { ...uiKeyOverrides, ...pinkHighlights },
  borderSource, borderKeyPattern, neutralRamp, neutralTint, blush, blushKeys,
};

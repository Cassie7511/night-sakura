#!/usr/bin/env node
// preview.js: opens a separate VS Code window with this theme loaded in development mode.
//
//   node preview.js                       opens the samples folder
//   node preview.js path\to\file.py ...   opens those files/folders instead
//
// The window uses its own settings folder (.preview-profile), so choosing a theme there never
// touches your normal VS Code. (F5's development window shares your real settings; picking an
// uninstalled theme there would make your normal windows fall back to the default theme.)
// After `node build.js`, the open preview window picks up the new colors live.

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const P = require('./palette');

const root = __dirname;
const profile = path.join(root, '.preview-profile');
const userDir = path.join(profile, 'User');
fs.mkdirSync(userDir, { recursive: true });

const settingsFile = path.join(userDir, 'settings.json');
let settings = {};
try { settings = JSON.parse(fs.readFileSync(settingsFile, 'utf8')); } catch { /* first run */ }
if (!P.variants.some(v => v.label === settings['workbench.colorTheme'])) settings['workbench.colorTheme'] = P.variants[0].label;
Object.assign(settings, {
  'workbench.startupEditor': 'none',
  'security.workspace.trust.enabled': false,
  'telemetry.telemetryLevel': 'off',
});
fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));

const targets = process.argv.length > 2 ? process.argv.slice(2).map(p => path.resolve(p)) : [path.join(root, 'samples')];
const args = ['--new-window', '--user-data-dir', profile, '--disable-extensions', `--extensionDevelopmentPath=${root}`, ...targets];
// code is a .cmd on Windows, which needs a shell: one command string, every argument quoted
spawn(['code', ...args.map(a => `"${a}"`)].join(' '), { shell: true, detached: true, stdio: 'ignore' }).unref();
console.log(`preview window opening with "${settings['workbench.colorTheme']}" (switch themes there with Ctrl+K Ctrl+T)`);

// palette-light.js: the LIGHT theme's palette. Edit a hex here, then `node build.js`.
//
// Structure comes from Tokyo Night Light (vendor/tokyo-night-light-color-theme.json, MIT).
// Code colors follow the DARK theme's decisions rule by rule: build.js looks up each Tokyo
// rule by name in the dark template and gives it the same role (keyword, function, string...)
// it has in palette.js. Only the colors behind the roles differ: on white, the site's pastels
// (#f6b3c5 is 1.6:1 on white) become deeper versions of the same hues so text stays readable.
// The pastel pink is still used where it is a FILL: buttons, badges, menu highlight.
//
// Background: a warm paper off-white editor (#faf8f5) with warm grays, chosen over a pure
// white / cool-gray version.

const ink = {
  text:  '#2b2b30', // main text (the site's cool charcoal)
  muted: '#6b6b73', // secondary UI text, operators, punctuation
  faint: '#8a8a92', // comments (the site's --muted gray)
};

const cherry = {
  pink:     '#c2416b', // deep cherry blossom: function names, links, cursor, headings (same hue as #f6b3c5)
  pinkDeep: '#a8355b', // pink text on tinted backgrounds (selected list item, terminal magenta)
  pinkDim:  '#a8506a', // this/self, HTML tags, spread
  blossom:  '#f6b3c5', // the site's pink, used as a fill: buttons, badges, menu highlight
  blossomHover: '#f29bb5',
  line:     '#e0789c', // thin accent lines: active tab, activity bar, progress bar
};

const deep = {
  violet:    '#7348b8', // keywords (the dark theme's lavender, deepened; hue 263, not blue)
  violetDim: '#7d62b0', // var / let / const
  sage:      '#46733a', // strings
  apricot:   '#a9532a', // numbers, constants
  ochre:     '#86620f', // function parameters
  mint:      '#2a7059', // regex, terminal "cyan"
  amber:     '#8f6200', // warnings, terminal "yellow"
  red:       '#c62f3d', // errors
};

// Code roles: same names as palette.js, light values. B layout (pink functions).
const codeRoles = {
  keyword:      deep.violet,
  keywordMod:   deep.violetDim,
  func:         cherry.pink,
  support:      '#141417',   // classes, built-ins, imports, properties (the dark theme's near-white, inverted)
  text:         ink.text,
  variable:     '#27272c',
  textDim:      '#55555c',
  comment:      ink.faint,   // italic
  commentDoc:   '#7e7e86',
  commentDocEm: '#74747c',
  string:       deep.sage,
  number:       deep.apricot,
  param:        deep.ochre,
  accent2:      cherry.pinkDim,
  objectKey:    '#45454c',
  operator:     ink.muted,
  punctuation:  ink.muted,
  tagPunct:     ink.faint,
  regex:        deep.mint,
  invalid:      deep.red,
  inserted:     deep.sage,
  deleted:      '#b03a46',
  changed:      deep.violet,
  warn:         deep.amber,
  error:        deep.red,
  debug:        deep.violet,
  pink:         cherry.pink,
  pinkDim:      cherry.pinkDim,
  peach:        deep.apricot,
  muted:        ink.muted,
};

// Tokyo Light rules whose names differ from the dark theme's, or that only exist here.
const ruleAliases = { 'Interpolation / PHP tags / Smarty tags': 'Interpolation, PHP tags, Smarty tags' };
const codeRuleOverrides = {
  'Tag Punctuation - Custom': 'tagPunct',
  'HTML Character Entity Punctuation': 'punctuation',
};
// Semantic / customization keys whose dark color makes no sense on white.
const semanticOverrides = {
  'parameter': '#5c4a3a',         // dark theme keeps Tokyo's warm off-white; here a warm dark brown
  'property.readonly': 'keywordMod',
  'variable.local': 'variable',
};

// Tokyo Light UI hex -> new hex, shared by both variants. Structural grays are added per variant.
const sharedUiMap = {
  '#363c4d': ink.text, '#343b58': ink.text, '#343b59': ink.text,
  '#707280': ink.muted,
  '#ffffff': '#ffffff', '#000000': '#000000',
  // Tokyo Light's accent blue -> pink
  '#2959aa': cherry.pink,
  '#7b43ba': cherry.pink,
  // other blues / purples -> violet (info, hints, git "modified", debug icons)
  '#3d59a1': deep.violet, '#637dbf': deep.violet, '#506fca': deep.violet, '#3e6396': deep.violet,
  '#68b3de': deep.violet, '#0da0ba': deep.violet, '#1abc9c': deep.violet, '#0db9d7': deep.violet,
  '#395b96': deep.violet, '#9a7ecc': deep.violet, '#5a3e8e': deep.violet, '#65359d': deep.violet,
  '#b267e6': deep.violet, '#4f4168': deep.violet, '#0f4b6e': deep.violet, '#698cd6': cherry.pinkDim,
  '#c0cefc': ink.text,
  // teals / greens -> sage ("added"), cyan -> mint
  '#006c86': deep.mint, '#3e6968': deep.mint, '#25aac2': deep.mint,
  '#166775': deep.sage, '#33635c': deep.sage, '#296973': deep.sage, '#449dab': deep.sage,
  '#41a6b5': deep.sage, '#2d9c91': deep.sage, '#007a75': deep.sage, '#385f0d': deep.sage,
  '#80a856': '#6f9a5c', '#71b6bd': '#8fb87c', '#c5e3d0': '#dcebd3',
  // yellows -> amber, oranges -> apricot
  '#8f5e15': deep.amber, '#bba461': deep.amber, '#ffdb69': deep.amber, '#cfa25f': '#c79a4a',
  '#c2985b': '#f2dcb3', '#e7e8c8': '#f3ead2', '#bb7a61': '#c98a2e',
  '#965027': deep.apricot, '#c97018': deep.apricot,
  // reds -> red
  '#942f2f': deep.red, '#bd4040': deep.red, '#c24242': deep.red, '#db4b4b': deep.red, '#a6333f': deep.red,
  '#bb616b': deep.red, '#8c4351': deep.red, '#69323d': deep.red, '#914c54': '#b03a46',
  '#e86868': '#e05a66', '#a8626a': '#d9737d', '#85353e': '#85353e', '#b05467': cherry.pinkDim,
  '#634f30': '#5c4a3a',
};

const uiKeyOverrides = {
  'editorCursor.foreground': cherry.pink,
  'terminalCursor.foreground': cherry.pink,
  'activityBar.activeBorder': cherry.line,
  'tab.activeBorder': cherry.line,
  'progressBar.background': cherry.line,
  'sash.hoverBorder': cherry.line,
  // Claude Code permission modes: auto = errorForeground (pink), plan = button.background +
  // focusBorder (violet). Auto's send button draws button.foreground on errorForeground, so
  // buttons carry WHITE text here (dark text on deep pink would be 2.9:1).
  'errorForeground': cherry.pink,
  'focusBorder': deep.violet + '55',
  'list.activeSelectionForeground': cherry.pinkDeep,
  'textLink.activeForeground': cherry.pinkDeep,

  // buttons: deep violet with white text (also Claude Code's plan mode)
  'button.background': deep.violet + 'ff',
  'button.hoverBackground': '#5f3aa0ff',
  'button.foreground': '#ffffff',
  'extensionButton.prominentBackground': deep.violet + 'ff',
  'extensionButton.prominentHoverBackground': '#5f3aa0ff',
  'extensionButton.prominentForeground': '#ffffff',
  // badges and menu highlight: the site's pastel pink as a fill, dark text on top
  'activityBarBadge.background': cherry.blossom,
  'activityBarBadge.foreground': ink.text,
  'extensionBadge.remoteBackground': cherry.blossom,
  'extensionBadge.remoteForeground': ink.text,
  'menu.selectionBackground': cherry.blossom,
  'menubar.selectionBackground': cherry.blossom,

  // find: pink tints (Tokyo Light uses its "added" teal here)
  'editor.findMatchBackground': cherry.pink + '40',
  'editor.findMatchHighlightBackground': cherry.pink + '22',
  'editor.findMatchBorder': cherry.pink,

  'inputValidation.infoBackground': deep.violet + '22',
  'inputValidation.infoBorder': deep.violet,

  // Tokyo Light reuses its accent blue for these; the dark theme gives them a quiet lavender,
  // so here they get violet rather than pink
  'gitDecoration.modifiedResourceForeground': deep.violet,
  'gitDecoration.stageModifiedResourceForeground': deep.violet,
  'gitlens.gutterUncommittedForegroundColor': deep.violet,
  'merge.incomingHeaderBackground': deep.violet + '55',
  'merge.incomingContentBackground': deep.violet + '22',
  'scmGraph.historyItemRefColor': deep.violet,
  'debugTokenExpression.name': deep.violet,
  'charts.blue': deep.violet,
  'activityBarTop.activeBorder': cherry.line,
  'panelTitle.activeBorder': cherry.line,
  'chat.avatarBackground': cherry.blossom,

  'editorBracketHighlight.foreground1': cherry.pinkDim,
  'editorBracketHighlight.foreground2': deep.violetDim,
  'editorBracketHighlight.foreground3': deep.sage,
  'editorBracketHighlight.foreground4': deep.apricot,
  'editorBracketHighlight.foreground5': deep.mint,
  'editorBracketHighlight.foreground6': deep.amber,
  'editorBracketPairGuide.activeBackground1': cherry.pinkDim,
  'editorBracketPairGuide.activeBackground2': deep.violetDim,
  'editorBracketPairGuide.activeBackground3': deep.sage,
  'editorBracketPairGuide.activeBackground4': deep.apricot,
  'editorBracketPairGuide.activeBackground5': deep.mint,
  'editorBracketPairGuide.activeBackground6': deep.amber,

  'terminal.ansiBlack': ink.text,        'terminal.ansiBrightBlack': ink.faint,
  'terminal.ansiRed': deep.red,          'terminal.ansiBrightRed': deep.red,
  'terminal.ansiGreen': deep.sage,       'terminal.ansiBrightGreen': deep.sage,
  'terminal.ansiYellow': deep.amber,     'terminal.ansiBrightYellow': deep.amber,
  'terminal.ansiBlue': deep.violet,      'terminal.ansiBrightBlue': deep.violet,
  'terminal.ansiMagenta': cherry.pinkDeep, 'terminal.ansiBrightMagenta': cherry.pinkDeep,
  'terminal.ansiCyan': deep.mint,        'terminal.ansiBrightCyan': deep.mint,
  'terminal.ansiWhite': ink.muted,       'terminal.ansiBrightWhite': ink.faint,
};

// Neutral conversion (Tokyo Light lightness -> new lightness), then a gray nudged by an RGB
// offset: cool for white, warm for off-white. An offset keeps the tint the same strength at
// every lightness (an HSL saturation would turn mid grays orange).
const rampBase = [[0, 0], [15, 9], [26, 17], [33, 25], [40, 34], [47, 44], [55, 53], [64, 66], [71, 78], [77, 88], [81, 91]];

function makeVariant({ id, label, editor, chrome, border, top, offset }) {
  return {
    id, label,
    uiHexMap: { ...sharedUiMap, '#e6e7ed': editor, '#d6d8df': chrome, '#c1c2c7': border },
    neutralRamp: [...rampBase, ...top],
    neutralTint: { rgbOffset: offset },
  };
}

// Off-white was chosen over pure white (2026-11-08).
const variants = [
  makeVariant({
    id: '', label: 'Cherry Blossom Light',
    editor: '#faf8f5', chrome: '#f1eeea', border: '#e3ded8',
    top: [[86, 93.5], [88, 95], [92, 97.6], [100, 99]],
    offset: [2, 0, -3],
  }),
];

module.exports = {
  template: 'tokyo-night-light-color-theme.json',
  filePrefix: 'cherry-blossom-light',
  uiTheme: 'vs',
  type: 'light',
  rolesFrom: { palette: './palette', ruleAliases },
  ink, cherry, deep, codeRoles, codeRuleOverrides, codeHexRoles: {}, semanticOverrides,
  uiKeyOverrides, borderSource: null, borderKeyPattern: /$^/, variants,
};

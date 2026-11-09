# Cherry Blossom

Dark and light VS Code themes in the black, gray and cherry-blossom pink of [cassie7511.github.io](https://cassie7511.github.io).

![Cherry Blossom dark and light](docs/preview.png)

## Install

```
npx --yes @vscode/vsce package --allow-missing-repository
code --install-extension cherry-blossom-0.3.1.vsix
```

Then pick **Cherry Blossom** or **Cherry Blossom Light** with Ctrl+K Ctrl+T.

## Change a color

Edit `palette.js` (dark) or `palette-light.js` (light) and run `node build.js`. The build won't save a theme with leftover blue or hard-to-read text.

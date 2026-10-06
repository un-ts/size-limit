---
"size-limit-node-esbuild": minor
"size-limit-preset-node-lib": patch
---

Delegate bundling to `@size-limit/esbuild` so the esbuild steps actually run, and report the plugin as `size-limit-esbuild` so `size-limit` recognises it as the esbuild plugin. The plugin now defaults `esbuildConfig.platform` to `node`, externalises package imports (`packages: 'external'`), and declares `size-limit` as a peer dependency to match `@size-limit/esbuild`.

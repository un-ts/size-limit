---
"size-limit-node-esbuild": minor
"size-limit-preset-node-lib": minor
---

Use the plugin types from `size-limit` instead of the local shims. `size-limit` 14.2.0 ships `Plugin`, `PluginConfig` and `PluginCheck`, so `size-limit-node-esbuild` re-exports those instead of declaring its own `SizeLimit*` types, and `step20` becomes optional as in the official plugin API.

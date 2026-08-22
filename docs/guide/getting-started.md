# Getting Started

## Installation

```bash
# npm
npm install esbuild-plugin-replace --save-dev

# yarn
yarn add esbuild-plugin-replace -D

# pnpm
pnpm add esbuild-plugin-replace -D
```

## Basic Usage

```typescript
import { build } from "esbuild";
import { replace } from "esbuild-plugin-replace";

await build({
  entryPoints: ["src/index.js"],
  bundle: true,
  plugins: [
    replace({
      __VERSION__: JSON.stringify("1.0.0"),
      __AUTHOR__: JSON.stringify("Your Name"),
    }),
  ],
});
```

This will replace every instance of `__VERSION__` with `"1.0.0"` and `__AUTHOR__` with `"Your Name"` in your bundled output.

## How It Works

The plugin uses `magic-string` to perform precise string replacements while maintaining source maps. It:

1. Reads each file that matches the filter
2. Searches for patterns matching your replacement keys
3. Replaces them with the specified values
4. Returns the modified content for bundling

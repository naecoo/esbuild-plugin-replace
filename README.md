# esbuild-plugin-replace

An esbuild plugin for replacing strings in files while bundling.

> Based on [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace)

[![CI](https://github.com/naecoo/esbuild-plugin-replace/actions/workflows/ci.yml/badge.svg)](https://github.com/naecoo/esbuild-plugin-replace/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/esbuild-plugin-replace.svg)](https://www.npmjs.com/package/esbuild-plugin-replace)
[![license](https://img.shields.io/npm/l/esbuild-plugin-replace.svg)](https://github.com/naecoo/esbuild-plugin-replace/blob/main/LICENSE)

[Documentation](https://naecoo.github.io/esbuild-plugin-replace/) | [GitHub](https://github.com/naecoo/esbuild-plugin-replace)

## Install

```bash
npm install esbuild-plugin-replace --save-dev
```

## Quick Start

```typescript
import { build } from "esbuild";
import { replace } from "esbuild-plugin-replace";

await build({
  entryPoints: ["src/index.js"],
  bundle: true,
  plugins: [
    replace({
      __VERSION__: JSON.stringify("1.0.0"),
      __AUTHOR__: JSON.stringify("naecoo"),
    }),
  ],
});
```

## Options

### Replacement Values

Specify replacements directly:

```typescript
replace({
  __VERSION__: JSON.stringify("1.0.0"),
});
```

Or use the `values` option:

```typescript
replace({
  values: {
    __VERSION__: JSON.stringify("1.0.0"),
  },
});
```

Values can also be functions:

```typescript
replace({
  __BUILD_TIME__: () => JSON.stringify(Date.now()),
});
```

### Filtering

- `include` - RegExp to match files to process (default: `/.*/`)
- `exclude` - RegExp to match files to skip

```typescript
replace({
  include: /\.js$/,
  exclude: /node_modules/,
  values: { __VERSION__: '"1.0.0"' },
});
```

### Delimiters

Custom delimiters for matching (default: word boundaries `\b`):

```typescript
replace({
  delimiters: ["", ""],
  "@/src/": "./src/",
});
```

## TypeScript

Full TypeScript support is included. Types are auto-generated.

```typescript
import { replace, ReplaceOptions } from "esbuild-plugin-replace";

const options: ReplaceOptions = {
  __VERSION__: JSON.stringify("1.0.0"),
};

replace(options);
```

## License

MIT

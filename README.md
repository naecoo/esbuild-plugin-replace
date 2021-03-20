# esbuild-plugin-replace
🚀 A Esbuild plugin which replaces targeted strings in files while bundling.

> This packages is based on [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace#readme)



## Install

using npm:
```console
npm install esbuild-plugin-replace --save-dev
```
using yarn:
```console
yarn add esbuild-plugin-replace -D
```

## Usage
```js
const { build } = require('esbuild');
const { replace } = require('esbuild-plugin-replace');
build({
  // other build options
  plugins: [
    replace({
        '__buildVersion': '"1.0.0"',
        '__author__': `'naecoo'`
    })
  ]
});
```

The configuration above will replace every instance of `__buildVersion` with `"1.0.0"` and `__author` with `'naecoo'`

*Note: Values must be either primitives (e.g. string, number) or `function` that returns a string. For complex values, use `JSON.stringify`. To replace a target with a value that will be evaluated as a string, set the value to a quoted string (e.g. `"test"`) or use `JSON.stringify` to preprocess the target string safely.*



## Options

In addition to the properties and values specified for replacement, users may also specify the options below.
### `include`
Type: `RegExp` <br/>
default: `/.*/` <br/>

Filters files that do not match RegExp expressions. By default all files are matched.

### `values`
Type: `{ [key: String]: Replacement }`, where `Replacement` is either a string or a `function` that returns a string.<br/>
Default: `{}`<br/>

To avoid mixing replacement strings with the other options, you can specify replacements in the `values` option. For example, the following signature:

```js
replace({
  include: /\.js$/,
  changed: "replaced"
});
```

Can be replaced with:

```js
replace({
  include: /\.js$/,
  values: {
    changed: "replaced"
  }
});
```



## Todo

1. Add test cases
2. Support `exclude` and `preventAssignment` options
# esbuild-plugin-replace
🚀 A Esbuild plugin which replaces targeted strings in files while bundling

> This package is based on [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace#readme)


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
Type: `RegExp`

default: `/.*/`

Filters files that **do not match** RegExp expressions. By default all files are matched.


### `exclude`
Type: `RegExp`

default: `null`

Filters files that **do match** the `exclude` RegExp expressions. When `include` and `exclude` are set at the same time, `include` is used first, and `exclude` doesn't work.  


### `values`
Type: `{ [key: String]: Replacement }`, where `Replacement` is either a string or a `function` that returns a string.

Default: `{}`

To avoid mixing replacement strings with the other options, you can specify replacements in the `values` option. For example, the following signature:

```javascript
replace({
  include: /\.js$/,
  changed: "replaced"
});
```

Can be replaced with:

```javascript
replace({
  include: /\.js$/,
  values: {
    changed: "replaced"
  }
});
```


### `delimiters`
Type: `Array[String, String]`

Default: `['\b', '\b']`

Specifies the boundaries around which strings will be replaced. By default, delimiters are word boundaries. See Word [Boundaries](https://stackoverflow.com/questions/1324676/what-is-a-word-boundary-in-regex) below for more information.
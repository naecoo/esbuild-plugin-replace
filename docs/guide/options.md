# Options

## Replacement Values

### Top-level Properties

You can specify replacements directly as top-level properties:

```typescript
replace({
  __VERSION__: JSON.stringify("1.0.0"),
  __AUTHOR__: JSON.stringify("test"),
});
```

### Values Option

Alternatively, use the `values` option to keep replacements separate from other options:

```typescript
replace({
  include: /\.js$/,
  values: {
    __VERSION__: JSON.stringify("1.0.0"),
    __AUTHOR__: JSON.stringify("test"),
  },
});
```

### Function Values

Values can be functions that receive the file path and return a string:

```typescript
replace({
  __BUILD_TIME__: (id) => JSON.stringify(new Date().toISOString()),
  __FILE_PATH__: (id) => JSON.stringify(id),
});
```

## Filtering Options

### include

- **Type:** `RegExp`
- **Default:** `/.*/`

Filter files that should be processed.

```typescript
replace({
  include: /\.js$/,
  values: { __VERSION__: '"1.0.0"' },
});
```

### exclude

- **Type:** `RegExp`
- **Default:** `null`

Filter files that should be skipped.

```typescript
replace({
  exclude: /node_modules/,
  values: { __VERSION__: '"1.0.0"' },
});
```

::: tip
When both `include` and `exclude` are set, `include` takes precedence.
:::

## Delimiters

### delimiters

- **Type:** `[string, string]`
- **Default:** `['\\b', '\\b']` (word boundaries)

Customize the boundaries around replacement keys:

```typescript
// Match without word boundaries
replace({
  delimiters: ["", ""],
  "@/src/": "./src/",
});
```

```typescript
// Default word boundaries
replace({
  "@/src/": "./src/",  // Won't match "@/src/" in "my@/src/"
});
```

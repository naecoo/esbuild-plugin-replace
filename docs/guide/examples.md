# Examples

## Basic Replacement

```typescript
import { replace } from "esbuild-plugin-replace";

replace({
  __VERSION__: JSON.stringify("1.0.0"),
  __AUTHOR__: JSON.stringify("naecoo"),
});
```

**Input:**
```javascript
console.log(__VERSION__);
console.log(__AUTHOR__);
```

**Output:**
```javascript
console.log("1.0.0");
console.log("naecoo");
```

## Using Functions

```typescript
replace({
  __BUILD_TIME__: () => JSON.stringify(Date.now()),
  __FILE__: (id) => JSON.stringify(id),
});
```

## Path Alias Replacement

```typescript
replace({
  delimiters: ["", ""],
  "@src/": "./src/",
  "@utils/": "./src/utils/",
});
```

**Input:**
```typescript
import { helper } from "@utils/helper";
```

**Output:**
```typescript
import { helper } from "./src/utils/helper";
```

## Environment Variables

```typescript
replace({
  "process.env.NODE_ENV": JSON.stringify("production"),
  "process.env.API_URL": JSON.stringify("https://api.example.com"),
});
```

## Conditional Replacement with Filter

```typescript
replace({
  include: /\.client\.js$/,
  exclude: /node_modules/,
  values: {
    __CLIENT__: JSON.stringify(true),
  },
});
```

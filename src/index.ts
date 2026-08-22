import { readFileSync } from "node:fs";
import MagicString from "magic-string";
import type { Plugin, OnLoadResult, OnLoadArgs } from "esbuild";

export type Replacement = string | ((id: string) => string);

export type Delimiters = [string, string];

export interface ReplaceOptions {
  [key: string]:
    | Replacement
    | Delimiters
    | RegExp
    | { [key: string]: Replacement }
    | undefined;

  values?: { [key: string]: Replacement };
  include?: RegExp;
  exclude?: RegExp;
  delimiters?: Delimiters;
}

const toFunction = (fnOrValue: Replacement): (id: string) => string => {
  return typeof fnOrValue === "function" ? fnOrValue : () => fnOrValue;
};

const escapeRegExp = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&");
};

const generatePattern = (
  keys: string[],
  delimiters?: Delimiters
): RegExp => {
  const escapedKeys = keys.map(escapeRegExp);
  if (delimiters) {
    const [open, close] = delimiters;
    return new RegExp(
      `${escapeRegExp(open)}(${escapedKeys.join("|")})${escapeRegExp(close)}`,
      "g"
    );
  }
  return new RegExp(`\\b(${escapedKeys.join("|")})\\b`, "g");
};

const replaceCode = (
  code: string,
  id: string,
  pattern: RegExp,
  replacements: Map<string, (id: string) => string>
): string => {
  const magicString = new MagicString(code);
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(code))) {
    const start = match.index;
    const end = start + match[0].length;
    const key = match[1];
    const replacer = replacements.get(key);

    if (replacer) {
      const replacement = String(replacer(id));
      magicString.overwrite(start, end, replacement);
    }
  }

  return magicString.toString();
};

const extractOptions = (
  options: ReplaceOptions
): {
  values: { [key: string]: Replacement };
  include?: RegExp;
  exclude?: RegExp;
  delimiters?: Delimiters;
} => {
  const { include, exclude, delimiters, values, ...rest } = options;

  const mergedValues: { [key: string]: Replacement } = { ...values };

  // Extract replacements from top-level options
  for (const key of Object.keys(rest)) {
    const value = rest[key];
    if (typeof value === "string" || typeof value === "function") {
      mergedValues[key] = value;
    }
  }

  return { values: mergedValues, include, exclude, delimiters };
};

const shouldSkipFile = (
  path: string,
  include: RegExp | undefined,
  exclude: RegExp | undefined
): boolean => {
  // If include is specified, it takes precedence over exclude
  if (include) {
    return false;
  }
  // Only apply exclude when include is not set
  return exclude ? exclude.test(path) : false;
};

export const replace = (options: ReplaceOptions = {}): Plugin => {
  const { values, include, exclude, delimiters } = extractOptions(options);

  const replacements = new Map<string, (id: string) => string>();
  for (const [key, value] of Object.entries(values)) {
    replacements.set(key, toFunction(value));
  }

  const keys = Array.from(replacements.keys()).sort(
    (a, b) => b.length - a.length
  );
  const pattern = generatePattern(keys, delimiters);

  const filter = include ?? /.*/;

  return {
    name: "replace",

    setup(build) {
      build.onLoad({ filter }, async (args): Promise<OnLoadResult | null> => {
        if (shouldSkipFile(args.path, include, exclude)) {
          return null;
        }

        const source = readFileSync(args.path, "utf-8");
        const contents =
          replacements.size === 0
            ? source
            : replaceCode(source, args.path, pattern, replacements);

        return { contents, loader: "default" };
      });
    },
  };
};

export default replace;

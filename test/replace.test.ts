import { describe, test, expect } from "vitest";
import { build } from "esbuild";
import { replace } from "../src/index.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const buildExample = async (
  input: string,
  options: Parameters<typeof replace>[0] = {}
) => {
  const { outputFiles } = await build({
    entryPoints: [path.join(__dirname, input)],
    write: false,
    bundle: true,
    plugins: [replace(options)],
  });
  return outputFiles![0].text;
};

describe("replace plugin", () => {
  describe("basic replacement", () => {
    test("replaces simple string values", async () => {
      const code = await buildExample("./fixtures/basic.js", {
        __VERSION__: JSON.stringify("1.0.0"),
        __AUTHOR__: JSON.stringify("test"),
      });
      expect(code).toContain("1.0.0");
      expect(code).toContain("test");
      expect(code).not.toContain("__VERSION__");
      expect(code).not.toContain("__AUTHOR__");
    });

    test("replaces function values", async () => {
      const code = await buildExample("./fixtures/basic.js", {
        __VERSION__: () => JSON.stringify("2.0.0"),
      });
      expect(code).toContain("2.0.0");
      expect(code).not.toContain("__VERSION__");
    });

    test("function receives file id as argument", async () => {
      let receivedId = "";
      await buildExample("./fixtures/basic.js", {
        __VERSION__: (id: string) => {
          receivedId = id;
          return JSON.stringify("1.0.0");
        },
      });
      expect(receivedId).toContain("basic.js");
    });
  });

  describe("values option", () => {
    test("replaces values from values option", async () => {
      const code = await buildExample("./fixtures/basic.js", {
        values: {
          __VERSION__: JSON.stringify("1.0.0"),
        },
      });
      expect(code).toContain("1.0.0");
      expect(code).not.toContain("__VERSION__");
    });

    test("top-level and values are merged", async () => {
      const code = await buildExample("./fixtures/basic.js", {
        __VERSION__: JSON.stringify("1.0.0"),
        values: {
          __AUTHOR__: JSON.stringify("test"),
        },
      });
      expect(code).toContain("1.0.0");
      expect(code).toContain("test");
    });
  });

  describe("include option", () => {
    test("only processes files matching include filter", async () => {
      const code = await buildExample("./fixtures/basic.js", {
        __VERSION__: JSON.stringify("1.0.0"),
        include: /\.txt$/,
      });
      expect(code).toContain("__VERSION__");
      expect(code).not.toContain("1.0.0");
    });

    test("processes files when include matches", async () => {
      const code = await buildExample("./fixtures/basic.js", {
        __VERSION__: JSON.stringify("1.0.0"),
        include: /\.js$/,
      });
      expect(code).not.toContain("__VERSION__");
      expect(code).toContain("1.0.0");
    });
  });

  describe("exclude option", () => {
    test("excludes files matching exclude filter", async () => {
      const code = await buildExample("./fixtures/basic.js", {
        __VERSION__: JSON.stringify("1.0.0"),
        exclude: /\.js$/,
      });
      expect(code).toContain("__VERSION__");
      expect(code).not.toContain("1.0.0");
    });

    test("processes files not matching exclude", async () => {
      const code = await buildExample("./fixtures/basic.js", {
        __VERSION__: JSON.stringify("1.0.0"),
        exclude: /\.ts$/,
      });
      expect(code).not.toContain("__VERSION__");
      expect(code).toContain("1.0.0");
    });

    test("include takes precedence over exclude", async () => {
      const code = await buildExample("./fixtures/basic.js", {
        __VERSION__: JSON.stringify("1.0.0"),
        include: /\.js$/,
        exclude: /\.js$/,
      });
      expect(code).not.toContain("__VERSION__");
      expect(code).toContain("1.0.0");
    });
  });

  describe("delimiters option", () => {
    test("uses custom delimiters", async () => {
      const code = await buildExample("./fixtures/delimiters.js", {
        "@/src/": "./",
        __VERSION__: JSON.stringify("1.0.0"),
        delimiters: ["", ""],
      });
      expect(code).not.toContain("@/src/");
      expect(code).toContain("./path-to-file");
      expect(code).not.toContain("__VERSION__");
      expect(code).toContain("1.0.0");
    });

    test("default delimiters use word boundaries", async () => {
      const code = await buildExample("./fixtures/delimiters.js", {
        "@/src/": "./",
        __VERSION__: JSON.stringify("1.0.0"),
      });
      expect(code).toContain("@/src/");
      expect(code).not.toContain("./path-to-file");
      expect(code).not.toContain("__VERSION__");
      expect(code).toContain("1.0.0");
    });
  });

  describe("edge cases", () => {
    test("handles empty values object", async () => {
      const code = await buildExample("./fixtures/basic.js", {});
      expect(code).toContain("__VERSION__");
      expect(code).toContain("__AUTHOR__");
    });

    test("handles special regex characters in keys", async () => {
      const code = await buildExample("./fixtures/special.js", {
        "$example": JSON.stringify("replaced"),
        delimiters: ["", ""],
      });
      expect(code).toContain("replaced");
      expect(code).not.toContain("$example");
    });

    test("handles multiple replacements in same line", async () => {
      const code = await buildExample("./fixtures/multiple.js", {
        __A__: JSON.stringify("A"),
        __B__: JSON.stringify("B"),
      });
      expect(code).toContain("A");
      expect(code).toContain("B");
      expect(code).not.toContain("__A__");
      expect(code).not.toContain("__B__");
    });
  });
});

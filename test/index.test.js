import { expect, test } from "vitest";
const path = require("path");
const { build } = require("esbuild");
const { replace } = require("..");

const buildExample = async (replacePluginOptions = {}) => {
  const { outputFiles } = await build({
    entryPoints: [path.resolve(__dirname, "./example.js")],
    outfile: path.resolve(__dirname, "./bundle.js"),
    write: false,
    bundle: true,
    plugins: [replace(replacePluginOptions)],
  });
  return outputFiles[0].text;
};

test("base-1", async () => {
  const code = await buildExample({
    __version__: JSON.stringify("1.0.0"),
    __author__: JSON.stringify("naecoo"),
  });
  expect(code).toMatch(/naecoo/);
  expect(code).toMatch(/1\.0\.0/);
});

test("base-2", async () => {
  const code = await buildExample({
    __author__: JSON.stringify("naecoo"),
  });
  expect(code).toMatch(/naecoo/);
  expect(code).toMatch(/__version__/);
  expect(code).not.toMatch(/1\.0\.0/);
});

test("options.include", async () => {
  const code = await buildExample({
    __version__: JSON.stringify("1.0.0"),
    __author__: JSON.stringify("naecoo"),
    include: /\.ts$/,
  });
  expect(code).not.toMatch(/naecoo/);
  expect(code).not.toMatch(/1\.0\.0/);
  expect(code).toMatch(/__author__/);
  expect(code).toMatch(/__version__/);
});

test("options.values", async () => {
  const code = await buildExample({
    __author__: JSON.stringify("naecoo"),
    values: {
      __version__: JSON.stringify("1.0.0"),
    },
  });
  expect(code).not.toMatch(/naecoo/);
  expect(code).toMatch(/__author__/);
  expect(code).toMatch(/1\.0\.0/);
});

test("options.exclude-1", async () => {
  const code = await buildExample({
    __author__: JSON.stringify("naecoo"),
    exclude: /\.js$/,
  });
  expect(code).not.toMatch(/naecoo/);
  expect(code).toMatch(/__author__/);
  expect(code).toMatch(/__version__/);
});

test("options.exclude-2", async () => {
  const code = await buildExample({
    __author__: JSON.stringify("naecoo"),
    exclude: /\.ts$/,
  });
  expect(code).toMatch(/naecoo/);
  expect(code).not.toMatch(/__author__/);
  expect(code).toMatch(/__version__/);
});

test("options.exclude-3", async () => {
  const code = await buildExample({
    __author__: JSON.stringify("naecoo"),
    include: /\.js$/,
    exclude: /\.js$/,
  });
  expect(code).toMatch(/naecoo/);
  expect(code).not.toMatch(/__author__/);
  expect(code).toMatch(/__version__/);
});

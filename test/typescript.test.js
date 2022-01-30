const path = require('path');
const { build } = require('esbuild');
const { replace } = require('..');

const buildExample = async (replacePluginOptions = {}) => {
  const { outputFiles } = await build({
    entryPoints: [path.resolve(__dirname, './example.ts')],
    outfile: path.resolve(__dirname, './bundle.js'),
    write: false,
    bundle: true,
    plugins: [replace(replacePluginOptions)]
  });
  return outputFiles[0].text;
}

test('delimiters-base-1', async () => {
  const code = await buildExample({
    '@/src/': './src/',
    '__version__': JSON.stringify('1.0.0'),
  });
  expect(code).toMatch(/\@\/src/);
  expect(code).not.toMatch(/\.\/src\/path-to-file/);
  expect(code).not.toMatch(/__version__/);
  expect(code).toMatch(/1\.0\.0/);
});

test('delimiters-base-2', async () => {
  const code = await buildExample({
    '@/src/': './',
    '__version__': JSON.stringify('1.0.0'),
    delimiters: ['', '']
  });
  expect(code).not.toMatch(/\@\/src/);
  expect(code).toMatch(/\.\/path-to-file/);
  expect(code).not.toMatch(/__version__/);
  expect(code).toMatch(/1\.0\.0/);
});
const path = require('path');
const { build } = require('esbuild');

const createBuild = () => {
  const formats = {
    cjs: 'index.js',
    esm: 'index.mjs'
  };
  Object.keys(formats).forEach((key) => {
    const fileName = formats[key];
    build({
      entryPoints: [path.resolve(__dirname, './src/index.js')],
      outfile: path.resolve(__dirname, './dist', fileName),
      external: ['fs'],
      bundle: true,
      minify: true,
      platform: 'node',
    }).then(() => {
      console.info(`— ${fileName} was built`);
    }).catch((e) => {
      console.info(`🚨 ${fileName} build error:`);
      console.error(e);
    });
  })
};

createBuild();
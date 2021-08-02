
const fs = require('fs');
const MagicString = require('magic-string');

const toFunction = (functionOrValue) => {
  if (typeof functionOrValue === 'function') return functionOrValue;
  return () => functionOrValue;
}

const longest = (a, b) => b.length - a.length;

const mapToFunctions = (options) => {
  const values = options.values ? Object.assign({}, options.values) : Object.assign({}, options);
  delete values.include;
  return Object.keys(values).reduce((fns, key) => {
    const functions = Object.assign({}, fns);
    functions[key] = toFunction(values[key]);
    return functions;
  }, {});
}

const generateFilter = (options) => {
  let filter = /.*/;
  if (options.include) {
    if (Object.prototype.toString.call(options.include) !== '[object RegExp]') {
      console.warn(`Options.include must be a RegExp object, but gets an '${typeof options.include}' type.`);
    } else {
      filter = options.include
    }
  }
  return filter;
}

const replaceCode = (code, id, pattern, functionValues) => {
  const magicString = new MagicString(code);
  while ((match = pattern.exec(code))) {
    const start = match.index;
    const end = start + match[0].length;
    const replacement = String(functionValues[match[1]](id));
    magicString.overwrite(start, end, replacement);
  }
  return magicString.toString();
}

exports.replace = (options = {}) => {
  const filter = generateFilter(options);
  const functionValues = mapToFunctions(options);
  const empty = Object.keys(functionValues).length === 0;
  const keys = Object.keys(functionValues).sort(longest).map(escape);
  const pattern = new RegExp(`\\b(${keys.join('|')})\\b`, 'g');
  return {
    name: 'replace',
    setup(build) {
      build.onLoad({ filter }, async (args) => {
        const source = await fs.promises.readFile(args.path, "utf8");
        const contents = empty ? source : replaceCode(source, args.path, pattern, functionValues)
        return { contents, loader: args.path.match(/tsx?$/) ? 'ts' : 'js' };
      });
    }
  };
}
module.exports = exports;

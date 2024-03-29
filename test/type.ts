import { replace } from '..';
import { build } from 'esbuild';


build({
  plugins: [
    replace({
      include: /.*/,
      exclude: /\.js$/,
      '__b__': JSON.stringify(1),
      delimiters: ['', ''],
      values: {
        '__a__': () => JSON.stringify(2)
      }
    })
  ]
})


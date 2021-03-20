import { replace } from '..';
import { build } from 'esbuild';


build({
  plugins: [
    replace({
      include: /.*/,
      '__b__': JSON.stringify(1),
      values: {
        '__a__': () => JSON.stringify(2)
      }
    })
  ]
})


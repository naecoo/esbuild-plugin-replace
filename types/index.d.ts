import { Plugin } from 'esbuild';

type Replacement = string | ((id: string) => string);
export interface EsBuildReplaceOptions {
  [prop: string]:
    Replacement
    | EsBuildReplaceOptions['include']
    | EsBuildReplaceOptions['values'];

  values?: { [prop: string]: Replacement };
  include?: RegExp
}

export function replace(options?: EsBuildReplaceOptions): Plugin;  

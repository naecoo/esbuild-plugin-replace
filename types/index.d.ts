import { Plugin } from 'esbuild';

type Replacement = string | ((id: string) => string);
type Delimiters = [string, string];
export interface EsBuildReplaceOptions {
  [prop: string]:
    Replacement
    | Delimiters
    | EsBuildReplaceOptions['include']
    | EsBuildReplaceOptions['values'];

  values?: { [prop: string]: Replacement };
  include?: RegExp;
  exclude?: RegExp;
  delimiters?: Delimiters;
}

export function replace(options?: EsBuildReplaceOptions): Plugin;
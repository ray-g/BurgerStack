import { TSCompiler } from '../libs/tscompiler';

import Config from '../config';

export = () => {
  return TSCompiler.compile(
    Config.client.ts,
    Config.dist.path,
    'tsconfig.json');
};

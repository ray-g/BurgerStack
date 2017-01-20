import { TSCompiler } from '../libs/tscompiler';

import Config from '../../config';

export = () => {
  return TSCompiler.compile(
    Config.server.entry,
    Config.dist.path,
    'tsconfig.json');
};

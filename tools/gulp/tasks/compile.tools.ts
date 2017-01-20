import { TSCompiler } from '../libs/tscompiler';

import Config from '../../config';

export = () => {
  return TSCompiler.compile(
    Config.tools.allTS,
    Config.dist.path,
    'tsconfig.json');
};

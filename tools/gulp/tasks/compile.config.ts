import { TSCompiler } from '../libs/tscompiler';

import Config from '../../config';

export = () => {
  return TSCompiler.compile(
    Config.config.serverConfig,
    Config.dist.path,
    'tsconfig.json');
};

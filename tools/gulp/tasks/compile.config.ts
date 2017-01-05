import { TSCompiler } from '../libs/tscompiler';

const config = require('../config');

export = () => {
  return TSCompiler.compile(
    config.config.serverConfig,
    config.dist.path,
    'tsconfig.json');
};

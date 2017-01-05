import { TSCompiler } from '../libs/tscompiler';

const config = require('../config');

export = () => {
  return TSCompiler.compile(
    config.tools.allTS,
    config.dist.path,
    'tsconfig.json');
};

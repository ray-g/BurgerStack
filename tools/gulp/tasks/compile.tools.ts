import { TSCompiler } from '../libs/tscompiler';

const config = require('../config');

export = () => {
  return TSCompiler.compile(
    config.tools.tools,
    config.dist.tools,
    'tsconfig.json');
};

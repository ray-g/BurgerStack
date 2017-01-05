import { TSCompiler } from '../libs/tscompiler';

const config = require('../config');

export = () => {
  return TSCompiler.compile(
    config.server.entry,
    config.dist.path,
    'tsconfig.json');
};

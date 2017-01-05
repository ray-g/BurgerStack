import { TSCompiler } from '../libs/tscompiler';

const config = require('../config');

export = () => {
  return TSCompiler.compile(
    config.server.ts,
    config.dist.server,
    'tsconfig.json');
};

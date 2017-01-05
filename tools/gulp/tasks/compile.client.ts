import { TSCompiler } from '../libs/tscompiler';

const config = require('../config');

export = () => {
  return TSCompiler.compile(
    config.client.ts,
    config.dist.path,
    'tsconfig.json');
};

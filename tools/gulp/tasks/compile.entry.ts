import { TSCompiler } from '../libs/tscompiler';

const baseAssets = require('../../../config/assets/base');

export = () => {
  return TSCompiler.compile(
    baseAssets.server.entry,
    baseAssets.dist.path,
    'tsconfig.json');
};

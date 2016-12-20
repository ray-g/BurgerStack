import { TSCompiler } from '../libs/tscompiler';

const baseAssets = require('../../../config/assets/base');

export = () => {
  return TSCompiler.compile(
    baseAssets.server.ts,
    baseAssets.dist.server);
};

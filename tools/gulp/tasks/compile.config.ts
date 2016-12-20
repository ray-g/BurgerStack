import { TSCompiler } from '../libs/tscompiler';

const baseAssets = require('../../../config/assets/base');

export = () => {
  return TSCompiler.compile(
    baseAssets.config.serverConfig,
    baseAssets.dist.config);
};

import { TSCompiler } from '../libs/tscompiler';

const baseAssets = require('../../../config/assets/base');

export = () => {
  TSCompiler.getInstance().compile(
    baseAssets.config.serverConfig,
    baseAssets.dist.config);
};

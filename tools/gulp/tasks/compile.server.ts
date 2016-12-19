import { TSCompiler } from '../libs/tscompiler';

const baseAssets = require('../../../config/assets/base');

export = () => {
  TSCompiler.getInstance().compile(
    baseAssets.server.ts,
    baseAssets.dist.server);
};

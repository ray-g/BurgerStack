import { TSCompiler } from '../libs/tscompiler';

const baseAssets = require('../../../config/assets/base');

export = () => {
  return TSCompiler.getInstance().compile(
    baseAssets.client.ts,
    baseAssets.dist.client);
};

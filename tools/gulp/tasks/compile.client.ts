import { TSCompiler } from '../libs/tscompiler';

const baseAssets = require('../../../config/assets/base');

export = () => {
  TSCompiler.getInstance().compile(
    baseAssets.client.ts,
    baseAssets.dist.client);
};

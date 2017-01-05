import { assetsUnion } from '../../../config/utils';
import { TSCompiler } from '../libs/tscompiler';

const config = require('../config');

export = () => {
  let assets = assetsUnion(
    config.tests.ts.all
  );

  return TSCompiler.compile(
    assets,
    config.dist.path,
    'tsconfig.json');
};

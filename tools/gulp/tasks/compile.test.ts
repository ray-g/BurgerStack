import { assetsUnion } from '../../../config/utils';
import { TSCompiler } from '../libs/tscompiler';

const config = require('../config');

export = () => {
  let assets = assetsUnion(
    config.tests.allTS
  );

  return TSCompiler.compile(
    assets,
    config.dist.tests,
    'tsconfig.json');
};

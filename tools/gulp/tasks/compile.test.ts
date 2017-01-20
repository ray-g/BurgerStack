import { assetsUnion } from '../../../config/utils';
import { TSCompiler } from '../libs/tscompiler';

import Config from '../config';

export = () => {
  let assets = assetsUnion(
    Config.tests.ts.all
  );

  return TSCompiler.compile(
    assets,
    Config.dist.path,
    'tsconfig.json');
};

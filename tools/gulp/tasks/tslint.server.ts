import { TSLinter } from '../libs/tslinter';
import { assetsUnion } from '../../utils';

const baseAssets = require('../../../config/assets/base');

/**
 * Executes the build process, linting the TypeScript files using `codelyzer`.
 */
export = () => {
  let assets = assetsUnion(baseAssets.server.ts);

  return TSLinter.getInstance().check(assets);
};

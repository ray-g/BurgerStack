import { TSLinter } from '../libs/tslinter';
import { assetsUnion } from '../../../config/utils';

const config = require('../config');

/**
 * Executes the build process, linting the TypeScript files using `codelyzer`.
 */
export = () => {
  let assets = assetsUnion(config.server.entry);

  return TSLinter.check(assets);
};

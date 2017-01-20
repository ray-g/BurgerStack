import { TSLinter } from '../libs/tslinter';
import { assetsUnion } from '../../../config/utils';
import Config from '../../config';

/**
 * Executes the build process, linting the TypeScript files using `codelyzer`.
 */
export = () => {
  let assets = assetsUnion(
    Config.tools.allTS,
    Config.tools.gulpFile
  );

  return TSLinter.check(assets);
};

import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { assetsUnion } from '../../utils';

const plugins = <any>gulpLoadPlugins();

const baseAssets = require('../../../config/assets/base');

/**
 * Executes the build process, linting the TypeScript files using `codelyzer`.
 */
export = () => {
  let assets = assetsUnion(baseAssets.config.serverConfig);

  return gulp.src(assets)
    .pipe(plugins.tslint({
      formatter: 'verbose',
      rulesDirectory: customRules()
    }))
    .pipe(plugins.tslint.report({
      emitError: require('is-ci')
    }));
};

function customRules(): string[] {
  let lintConf = require('../../../tslint.json');
  return lintConf.rulesDirectory;
}

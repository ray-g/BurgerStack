import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';

let baseAssets = require('../../../config/assets/base');

const plugins = <any>gulpLoadPlugins();

/**
 * Executes the build process, linting the TypeScript files using `codelyzer`.
 */
export = () => {
  return gulp.src(baseAssets.config.serverConfig)
    .pipe(plugins.tslint({
      formatter: 'verbose'
    }))
    .pipe(plugins.tslint.report({
      emitError: require('is-ci')
    }));
};

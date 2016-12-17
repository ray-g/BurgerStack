import * as _ from 'lodash';
import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';

const plugins = <any>gulpLoadPlugins();

const baseAssets = require('../../../config/assets/base');

/**
 * Executes the build process, linting the TypeScript files using `codelyzer`.
 */
export = () => {
  let assets = _.union(baseAssets.config.serverConfig);

  return gulp.src(<string[]>assets)
    .pipe(plugins.tslint({
      formatter: 'verbose'
    }))
    .pipe(plugins.tslint.report({
      emitError: require('is-ci')
    }));
};

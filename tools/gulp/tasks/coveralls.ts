import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
const plugins = <any>gulpLoadPlugins();
const config = require('../config');

export = (done: any) => {
  return gulp.src(config.tests.coverageDir + '/**/lcov.info')
    .pipe(plugins.coveralls());
};

import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
const plugins = <any>gulpLoadPlugins();
import Config from '../../config';

export = (done: any) => {
  return gulp.src(Config.tests.coverageDir + '/**/lcov.info')
    .pipe(plugins.coveralls());
};

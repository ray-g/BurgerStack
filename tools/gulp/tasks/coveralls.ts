import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
const plugins = <any>gulpLoadPlugins();
const config = require('../config');

export = (done: any) => {
  gulp.src(config.tests.coverageDir + '/**/lcov.info')
    .pipe(plugins.if(require('is-ci'), plugins.coveralls()));
};

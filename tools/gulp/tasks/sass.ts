import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';

const plugins = <any>gulpLoadPlugins();
const config = require('../config');

export = () => {
  return gulp.src(config.client.sass, {
    base: config.client.path
  })
    .pipe(plugins.sass({ errLogToConsole: true }))
    .pipe(plugins.sass({ style: 'expanded', debug_info: true }))
    .pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(gulp.dest(config.dist.client));
};

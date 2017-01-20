import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import Config from '../../config';

const plugins = <any>gulpLoadPlugins();

export = () => {
  return gulp.src(Config.client.sass, {
    base: Config.client.path
  })
    .pipe(plugins.sass({ errLogToConsole: true }))
    .pipe(plugins.sass({ style: 'expanded', debug_info: true }))
    .pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(gulp.dest(Config.dist.client));
};

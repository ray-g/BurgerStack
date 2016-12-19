import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';

const plugins = <any>gulpLoadPlugins();

/**
 * This is just an sample.
 * Copy this file and rename it to a meaningful task name.
 * Then write your own gulp task.
 */
export = () => {
  // Write your own tasks here.
  gulp.src('/not_exist_src')
  .pipe(gulp.dest('/not_exist_dest'))
  .pipe(plugins.util.log(plugins.util.yellow('This is a sample task')));
};

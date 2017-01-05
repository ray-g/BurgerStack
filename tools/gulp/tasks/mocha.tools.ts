import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';

const plugins = <any>gulpLoadPlugins();
const config = require('../config');

export = (done: any) => {
  let testSuites = config.tests.tools;
  let error: any = null;

  gulp.src(testSuites)
    .pipe(plugins.mocha({
      reporter: 'spec',
      timeout: 10000
    }))
    .on('error', (err: any) => {
      // If an error occurs, save it
      error = err;
    })
    .once('end', () => {
      // When the tests are done, disconnect databases and pass the error state back to gulp
      if (error) {
        plugins.util.log(plugins.util.colors.red('Mocha got error(s).'));
        // process.exit(1);
      }
      done();
    });
};

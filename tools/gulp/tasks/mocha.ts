import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { Databases } from '../../../config/libs/databases';

const plugins = <any>gulpLoadPlugins();
const taseAssets = require('../../../config/assets/test');

export = (done: any) => {
  let testSuites = taseAssets.tests.server;
  let error: any = {};

  Databases.connect()
    .then(() => {
      Databases.loadModels(null);
    })
    .then(() => {
      gulp.src(testSuites)
        .pipe(plugins.mocha({
          reporter: 'spec',
          timeout: 10000
        }))
        .on('error', (err: any) => {
          // If an error occurs, save it
          error = err;
        })
        .on('end', () => {
          // When the tests are done, disconnect databases and pass the error state back to gulp
          Databases.disconnect(function () {
            done(error);
          });
        });
    });
};

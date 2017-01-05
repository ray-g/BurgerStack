import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { Databases } from '../../../config/libs/databases';

const isparta = require('isparta');
const remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
const plugins = <any>gulpLoadPlugins();
const config = require('../config');

export = (done: any) => {
  let testSuites = config.tests.js.server;
  let error: any = null;

  gulp.src(['dist/**/*.js'])
    // Covering files
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.istanbul({
      instrumenter: isparta.Instrumenter,
      includeUntested: true
    }))
    // Force `require` to return covered files
    .pipe(plugins.istanbul.hookRequire())
    .on('finish', () => {
      Databases.connect()
        .then(() => {
          Databases.loadModels(null);
        })
        .then(() => {
          gulp.src(testSuites, { cwd: 'dist' })
            .pipe(plugins.mocha({
              ui: 'bdd',
              reporter: 'spec',
              timeout: 10000
            }))
            .pipe(plugins.istanbul.writeReports({
              dir: config.tests.coverageDir,
              reporters: ['json']
            }))
            .on('error', (err: any) => {
              // If an error occurs, save it
              error = err;
            })
            .on('end', () => {
              // When the tests are done, disconnect databases and pass the error state back to gulp
              Databases.disconnect(() => {
                if (error) {
                  plugins.util.log(plugins.util.colors.red('Mocha got error(s).'));
                  // process.exit(1);
                }
              });

              gulp.src('./coverage/coverage-final.json')
                .pipe(remapIstanbul({
                  basePath: '.',
                  reports: {
                    'html': './coverage',
                    'text-summary': null,
                    'lcovonly': './coverage/lcov.info'
                  }
                }))
                .on('finish', () => {
                  gulp.src('./coverage/lcov.info')
                  .pipe(plugins.coveralls());
                });

              done();
            });
        });
    });


};

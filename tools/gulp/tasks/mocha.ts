import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { Databases } from '../../../config/libs/databases';
import { instrument } from '../libs/instrument';

const isparta = require('isparta');
const remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
const plugins = <any>gulpLoadPlugins();
const config = require('../config');

export = (done: any) => {
  let testSuites = config.tests.js.server;
  let error: any = null;

  let coverageDir = config.tests.coverageDir + '/mocha';

  instrument(config.dist.allJS, coverageDir, gulp, plugins, isparta)
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
              dir: coverageDir,
              reporters: ['json']
            }))
            .on('error', (err: any) => {
              // If an error occurs, save it
              error = err;
            })
            .once('end', () => {
              // When the tests are done, disconnect databases and pass the error state back to gulp
              Databases.disconnect(() => {
                if (error) {
                  plugins.util.log(plugins.util.colors.red('Mocha got error(s).'));
                  // process.exit(1);
                }
              });

              gulp.src(coverageDir + '/coverage-final.json')
                .pipe(remapIstanbul({
                  basePath: '.',
                  reports: {
                    'html': coverageDir + '/html',
                    'text-summary': null,
                    'lcovonly': coverageDir + '/lcov.info'
                  }
                }));

              done();
            });
        });
    });
};

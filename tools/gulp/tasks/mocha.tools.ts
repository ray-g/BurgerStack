import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { instrument } from '../libs/instrument';
import Config from '../config';

const isparta = require('isparta');
const remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
const plugins = <any>gulpLoadPlugins();

export = (done: any) => {
  let testSuites = Config.tests.js.tools;
  let error: any = null;

  let coverageDir = Config.tests.coverageDir + '/mocha.tools';

  instrument(Config.dist.allJS, coverageDir, gulp, plugins, isparta, true)
    .on('finish', () => {
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
          if (error) {
            plugins.util.log(plugins.util.colors.red('Mocha got error(s).'));
            // process.exit(1);
          }

          gulp.src(coverageDir + '/coverage-final.json')
            .pipe(remapIstanbul({
              basePath: './',
              reports: {
                'html': coverageDir + '/html',
                'text-summary': null,
                'lcovonly': coverageDir + '/lcov.info'
              }
            }))
            .on('finish', () => {
              done();
            });
        });
    });
};

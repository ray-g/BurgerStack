process.env.NODE_ENV = 'test';

import * as gulp from 'gulp';
import { existsSync } from 'fs';
import { resolve } from 'path';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { Databases } from '../../../config/libs/databases';
import { instrument } from '../libs/instrument';

const isparta = require('isparta');
const remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
const plugins = <any>gulpLoadPlugins();
const config = require('../config');
const del = require('del');

const argv = require('yargs')
  .usage('Usage: $0 <options> <file1,file2,...>')
  .demandOption(['f'])
  .alias('f', 'file')
  .argv;

export = (done: any) => {
  const args = argv.f;
  const files = args.split(',');
  let testSuites: string[] = [];

  files.forEach((file: string) => {
    if (existsSync(resolve(file))) {
      testSuites.push(file);
    } else {
      plugins.util.log(plugins.util.colors.red('File: "' + file + '" not exists!'));
      process.exit(1);
    }
  });

  plugins.util.log('Running with:\n', testSuites);

  let error: any = null;

  let coverageDir = config.tests.coverageDir + '/tmp';

  del(coverageDir + '/*');

  instrument(config.dist.allJS, coverageDir, gulp, plugins, isparta, false)
    .on('finish', () => {
      Databases.connect()
        .then(() => {
          Databases.loadModels(null);
        })
        .then(() => {
          gulp.src(testSuites, { cwd: './' })
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
                  process.exit(1);
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

import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { instrument } from '../libs/instrument';
import Config from '../config';

const isparta = require('isparta');
const remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
const plugins = <any>gulpLoadPlugins();

export = (done: any) => {
  let coverageDir = Config.tests.coverageDir + '/karma';

  instrument(Config.dist.allJS, coverageDir, gulp, plugins, isparta, true)
    .on('finish', () => {
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
};

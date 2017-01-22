import { startKarma } from '../../utils/karma.start';

import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { assetsUnion } from '../../../config/utils';
import { instrument } from '../libs/instrument';
import Config from '../config';

const isparta = require('isparta');
const remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
const plugins = <any>gulpLoadPlugins();
/**
 * Executes the build process, running all unit tests using `karma`.
 */
export = (done: any) => {
  // let testSuites = assetsUnion(Config.tests.js.client);
  // let error: any = null;
  let coverageDir = Config.tests.coverageDir + '/karma';

  instrument(Config.dist.allJS, coverageDir, gulp, plugins, isparta, true)
    .on('finish', () => {

    });

  return startKarma(done, {
    preprocessors: {
      'dist/client/**/*.js': ['coverage']
    },
    reporters: ['mocha', 'coverage'],
    coverageReporter: {
      dir: coverageDir,
      reporters: [
        { type: 'json', subdir: '.', file: 'coverage-final.json' }
      ]
    },
  });
};

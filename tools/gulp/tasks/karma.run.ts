import { startKarma } from '../../utils/karma.start';
import Config from '../config';

/**
 * Executes the build process, running all unit tests using `karma`.
 */
export = (done: any) => {
  let coverageDir = Config.tests.coverageDir + '/karma';

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

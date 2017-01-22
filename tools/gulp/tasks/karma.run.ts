import { startKarma } from '../../utils/karma.start';
/**
 * Executes the build process, running all unit tests using `karma`.
 */
export = (done: any) => {
  return startKarma(done, {
    preprocessors: {
      'dist/client/**/*.js': ['coverage']
    },
    reporters: ['mocha', 'coverage'],
    coverageReporter: {
      dir: 'coverage/karma/',
      reporters: [
        { type: 'json', subdir: '.', file: 'coverage-final.json' }
      ]
    },
  });
};

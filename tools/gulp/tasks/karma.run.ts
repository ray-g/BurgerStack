import { startKarma } from '../../utils/karma.start';
/**
 * Executes the build process, running all unit tests using `karma`.
 */
export = (done: any) => {
  return startKarma(done, {
    preprocessors: {
      'dist/!(test)/**/*.js': ['coverage']
    },
    reporters: ['mocha', 'coverage'],
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'json', subdir: '.', file: 'coverage-final.json' }
      ]
    },
  });
};

// Karma configuration
// Generated on Tue Jan 03 2017 22:49:18 GMT-0800 (PST)

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '.',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon'],


    // list of files / patterns to load in the browser
    files: [
      // Polyfills.
      'node_modules/core-js/client/shim.min.js',

      'node_modules/traceur/bin/traceur.js',

      // System.js for module loading
      'node_modules/systemjs/dist/system.src.js',

      // Zone.js dependencies
      'node_modules/zone.js/dist/zone.js',
      'node_modules/zone.js/dist/long-stack-trace-zone.js',
      'node_modules/zone.js/dist/async-test.js',
      'node_modules/zone.js/dist/fake-async-test.js',
      'node_modules/zone.js/dist/sync-test.js',
      'node_modules/zone.js/dist/proxy.js',
      'node_modules/zone.js/dist/mocha-patch.js',

      // RxJs.
      { pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
      { pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false },

      // paths loaded via module imports
      // Angular itself
      { pattern: 'node_modules/@angular/**/*.js', included: false, watched: true },
      { pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: false },

      { pattern: 'dist/client/**/*.js', included: false, watched: true },
      { pattern: 'dist/test/client/**/*.js', included: false, watched: true },
      { pattern: 'dist/client/**/*.html', included: false, watched: true, served: true },
      { pattern: 'dist/client/**/*.css', included: false, watched: true, served: true },
      { pattern: 'node_modules/systemjs/dist/system-polyfills.js', included: false, watched: false }, // PhantomJS2 (and possibly others) might require it
      { pattern: 'node_modules/chai/**/*.js', included: false, watched: false },
      { pattern: 'node_modules/assertion-error/**/*.js', included: false, watched: false },
      { pattern: 'node_modules/sinon/**/*.js', included: false, watched: false },

      // suppress annoying 404 warnings for resources, images, etc.
      { pattern: 'dist/client/assets/**/*', watched: false, included: false, served: true },

      'tools/testconfig/test.config.js',
      'dist/client/app/systemjs.config.js',
      'tools/testconfig/test.main.js'
    ],

    // must go along with above, suppress annoying 404 warnings.
    proxies: {
      '/assets/': '/base/dist/client/assets/',
      '/npm/': '/base/node_modules/'
    },


    // list of files to exclude
    exclude: [
      'node_modules/**/*spec.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['PhantomJS'],
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};

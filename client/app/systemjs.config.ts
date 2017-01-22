declare var System: SystemJSLoader.System;

// let SYSTEM_CONFIG = {
System.config({
  defaultJSExtensions: true,

  paths: {
    // paths serve as alias
    'npm:': 'npm/'
  },
  // map tells the System loader where to look for things
  map: {
    // our app is within the app folder
    app: 'app',

    // angular bundles
    '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
    '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
    '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
    '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
    '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
    '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
    '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
    '@angular/upgrade': 'npm:@angular/upgrade/bundles/upgrade.umd.js',
    '@angular/upgrade/static': 'npm:@angular/upgrade/bundles/upgrade-static.umd.js',

    '@angular/common/testing': 'npm:@angular/common/bundles/common-testing.umd.js',
    '@angular/compiler/testing': 'npm:@angular/compiler/bundles/compiler-testing.umd.js',
    '@angular/core/testing': 'npm:@angular/core/bundles/core-testing.umd.js',
    '@angular/http/testing': 'npm:@angular/http/bundles/http-testing.umd.js',
    '@angular/platform-browser/testing': 'npm:@angular/platform-browser/bundles/platform-browser-testing.umd.js',
    '@angular/platform-browser-dynamic/testing': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',
    '@angular/router/testing': 'npm:@angular/router/bundles/router-testing.umd.js',

    // other libraries
    'rxjs': 'npm:rxjs',

    // For test config
    'chai': 'npm:chai/chai.js',
    'assertion-error': 'npm:assertion-error/index.js',
    'sinon': 'npm:sinon/lib/sinon.js',
    'dist/client/*': '/base/dist/client/*',
    'dist/test/client/*': '/base/dist/test/client/*',
    '*': 'npm:*',
  },
  // packages tells the System loader how to load when no filename and/or no extension
  packages: {
    rxjs: {
      defaultExtension: 'js'
    }
  }
});

// System.config(SYSTEM_CONFIG);

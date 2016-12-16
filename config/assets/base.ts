import { join } from 'path';

const BaseAssets = {
  client: {
    lib: {
      npm: 'node_modules',
      local: 'client/npm',
      css: [
        // node modeles needs copied to dist
        'bootstrap/dist/css/bootstrap.css',
        'normalize.css/normalize.css',
        'ionicons/css/ionicons.css',
        'ionicons/fonts/*',
        'font-awesome/css/font-awesome.css',
        'font-awesome/fonts/*'
      ],
      js: [
        // node modeles needs copied to dist
        'core-js/client/**',
        'zone.js/dist/zone.js',
        'reflect-metadata/Reflect.js',
        'reflect-metadata/Reflect.js.map',
        'systemjs/dist/system.src.js',
        'bootstrap/dist/js/bootstrap.js',
        'jquery/dist/jquery.js',
        'tether/dist/js/tether.js',
        'socket.io-client/socket.io.js'
      ],
      tests: ['']
    },
    ts: ['client/!(typings)/**/*.ts', 'client/*.ts', '!client/*.d.ts'],
    sass: ['client/app/**/*.s+(a|c)ss'],
    systemJSConfig: 'client/systemjs.config.js',
    img: [
      'client/assets/img/**/*.jpg',
      'client/assets/img/**/*.png',
      'client/assets/img/**/*.gif',
      'client/assets/img/**/*.svg'
    ],
    views: ['client/**/*.html']
  },
  server: {
    ts: ['server/!(typings)/**/*.ts', 'server.ts'],
    runtime: {
      postgresModels: 'server/modules/*/pgmodels/**/*.js',
      mongodbModels: 'server/modules/*/mdmodels/**/*.js',
      routes: ['server/modules/!(core)/routes/**/*.js', 'server/modules/core/routes/**/*.js'],
      sockets: 'server/modules/*/sockets/**/*.js',
      config: ['server/modules/*/config/**/*.js'],
      policies: 'server/modules/*/policies/**/*.js',
    }
  },
  config: {
    gulpFile: ['gulpfile.ts'],
    gulpTasks: ['utils/gulp/tasks/*.ts'],
    gulpTasksDir: join(process.cwd(), 'tools', 'gulp', 'tasks', ),
    serverConfig: ['config/**/*.ts']
  },
  dist: {
    path: 'dist',
    npm_relative: '../node_modules',
    all: ['dist/**/*.js'],
    entry: 'dist/server.js',
    serverAll: ['dist/server/**/*.*', 'dist/config/**/*.*', 'dist/server.js'],
    clientAll: ['dist/client/**/*.*']
  }
};

export = BaseAssets;

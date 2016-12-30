const BaseAssets = {
  client: {
    lib: {
      npm: 'node_modules',
      local: 'client/npm',
      css: [
        // node modules needs copied to dist
        'bootstrap/dist/css/bootstrap.css',
        'normalize.css/normalize.css',
        'ionicons/css/ionicons.css',
        'ionicons/fonts/*',
        'font-awesome/css/font-awesome.css',
        'font-awesome/fonts/*'
      ],
      js: [
        // node modules needs copied to dist
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
    entry: 'server.ts',
    runtime: {
      postgresModels: 'server/*/pgmodels/**/*.js',
      mongodbModels: 'server/*/mdmodels/**/*.js',
      routes: ['server/!(core)/routes/**/*.js', 'server/core/routes/**/*.js'],
      sockets: 'server/*/sockets/**/*.js',
      config: ['server/*/config/**/*.js'],
      policies: 'server/*/policies/**/*.js',
    }
  },
  config: {
    serverConfig: ['config/**/*.ts'],
  },
  tools: {
    gulpFile: 'gulpfile.ts',
    gulpTasks: 'tools/gulp/tasks/!(_)*.ts',
    utils: 'tools/utils/*.ts',
    tools: 'tools/**/*.ts'
  },
  dist: {
    path: 'dist',
    config: 'dist/config',
    server: 'dist',
    client: 'dist/client',
    npm_relative: '../node_modules',
    all: ['dist/*'],
    entry: 'dist/server.js',
    serverAll: ['dist/server/**/*.*', 'dist/config/**/*.*', 'dist/server.js'],
    clientAll: ['dist/client/**/*.*']
  }
};

export = BaseAssets;

const BaseAssets = {
  client: {
    systemJSConfig: 'client/systemjs.config.js',
    assets: [
      'client/assets/**'
    ],
    views: ['client/**/*.html']
  },
  server: {
    entry: 'server.js',
    routes: ['server/!(core)/routes/**/*.js', 'server/core/routes/**/*.js'],
    postgresModels: 'server/*/pgmodels/**/*.js',
    mongodbModels: 'server/*/mgmodels/**/*.js',
    sockets: 'server/*/sockets/**/*.js',
    config: ['server/*/config/**/*.js'],
    policies: 'server/*/policies/**/*.js',
  }
};

export = BaseAssets;

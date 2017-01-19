// Look in ./tools/webpack folder for webpack.<NODE_ENV>.js
switch (process.env.NODE_ENV) {
  case 'prod':
  case 'production':
    module.exports = require('./tools/webpack/webpack.prod')({env: 'production'});
    break;
  case 'test':
  case 'testing':
    module.exports = require('./tools/webpack/webpack.test')({env: 'test'});
    break;
  case 'dev':
  case 'development':
  default:
    module.exports = require('./tools/webpack/webpack.dev')({env: 'development'});
}

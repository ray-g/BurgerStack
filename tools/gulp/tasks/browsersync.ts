import { Config } from '../../../config/config';

let config = <any>Config.getInstance().getConfig();

export = () => {
  if (config.browserSync && config.browserSync.enable === true) {
    let server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;

    let browserSync = require('browser-sync').create();
    browserSync.init(null, {
      proxy: server,
      logFileChanges: false,
      files: [],
      browser: 'default',
      port: config.browserSync.port,
      open: false
    });
  }
};

import { Config } from '../../../config/config';

let config = <any>Config.getInstance().getConfig();

export = () => {
  console.log(config);
  if (config.browserSync && config.browserSync.enable === true) {
    let server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;

    let browserSync = require('browser-sync').create();
    console.log(browserSync);
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

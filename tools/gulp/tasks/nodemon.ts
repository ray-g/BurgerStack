import { BrowserSync } from '../libs/browsersync';
import * as gulpLoadPlugins from 'gulp-load-plugins';

const plugins = <any>gulpLoadPlugins();
const baseAssets = require('../../../config/assets/base');

// Nodemon task
let nodemon_instance: any;
export = () => {
  if (!nodemon_instance) {
    nodemon_instance = plugins.nodemon({
      script: baseAssets.dist.entry,
      nodeArgs: ['--debug'],
      ext: 'js, html',
      watch: baseAssets.dist.entry
    })
      .on('restart', function () {
        console.log('File changed, restarting server...');
        BrowserSync.getInstance().delayReload();
      });
  } else {
    nodemon_instance.emit('restart');
  }
};

import { BrowserSync } from '../libs/browsersync';
import * as gulpLoadPlugins from 'gulp-load-plugins';

const plugins = <any>gulpLoadPlugins();

export class NodeMon {
  private static _instance: NodeMon = new NodeMon();

  private static nodemon_instance: any;

  public static getInstance(): NodeMon {
    return NodeMon._instance;
  }

  // Nodemon task
  public static start(entry: string, watch: string[], fileExt: string, args: string[]): void {
    if (!NodeMon.nodemon_instance) {
      NodeMon.nodemon_instance = plugins.nodemon({
        script: entry,
        nodeArgs: args,
        ext: fileExt,
        watch: watch
      })
        .on('restart', function () {
          console.log('File changed, restarting server...');
          BrowserSync.getInstance().delayReload();
        });
    } else {
      NodeMon.nodemon_instance.emit('restart');
    }
  };

  public static reload(): void {
    if (NodeMon.nodemon_instance) {
      NodeMon.nodemon_instance.emit('restart');
    }
  }

  constructor() {
    if (NodeMon._instance) {
      throw new Error('Error: Instantiation failed: Use NodeMon.getInstance() instead of new.');
    }
    NodeMon._instance = this;
  }
}

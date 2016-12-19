import { Config } from '../../../config/config';
import * as browserSync from 'browser-sync';

const config = <any>Config.getInstance().getConfig();

export class BrowserSync {
  private static _instance: BrowserSync = new BrowserSync();

  private browserSync: any; // browserSync.BrowserSyncInstance;

  public static getInstance(): BrowserSync {
    return BrowserSync._instance;
  }

  constructor() {
    if (BrowserSync._instance) {
      throw new Error('Error: Instantiation failed: Use BrowserSync.getInstance() instead of new.');
    }
    this.initBrowserSync();
    BrowserSync._instance = this;
  }

  private initBrowserSync() {
    if (config.browserSync && config.browserSync.enable === true) {
      this.browserSync = browserSync.create();
    }
  }

  public startServer() {
    if (this.browserSync) {
      let server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;

      this.browserSync.init(null, {
        proxy: server,
        logFileChanges: false,
        files: [],
        browser: 'default',
        port: config.browserSync.port,
        open: false
      });
    }
  }

  public delayReload() {
    if (this.browserSync) {
      setTimeout(function () {
        console.log('File changed, refreshing browser...');
        this.browserSync.reload({ stream: false });
      }, config.browserSync.delayReload);
    }
  }

  public reload() {
    if (this.browserSync) {
      console.log('File changed, refreshing browser...');
      this.browserSync.reload();
    }
  }
}

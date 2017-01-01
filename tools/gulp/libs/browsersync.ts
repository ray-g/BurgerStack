import * as baseEnv from '../../../config/env/base';
import * as browserSync from 'browser-sync';

const bsConf = {
  enable: true,
  port: 7000,
  delayReload: 3000 // delay 3 seconds waiting for nodemon to finish restart.
};

export class BrowserSync {
  private static _instance: BrowserSync = new BrowserSync();

  private browserSync: any; // browserSync.BrowserSyncInstance;

  public static getInstance(): BrowserSync {
    return BrowserSync._instance;
  }

  public static startServer(): void {
    BrowserSync._instance.startServer();
  }

  public static delayReload(): void {
    BrowserSync._instance.delayReload();
  }

  public static reload(): void {
    BrowserSync._instance.reload();
  }

  constructor() {
    if (BrowserSync._instance) {
      throw new Error('Error: Instantiation failed: Use BrowserSync.getInstance() instead of new.');
    }
    this.initBrowserSync();
    BrowserSync._instance = this;
  }

  private initBrowserSync() {
    if (bsConf.enable === true) {
      this.browserSync = browserSync.create();
    }
  }

  public startServer() {
    if (this.browserSync) {
      let server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + baseEnv.host + ':' + baseEnv.port;

      this.browserSync.init(null, {
        proxy: server,
        logFileChanges: false,
        files: [],
        browser: 'default',
        port: bsConf.port,
        open: false
      });
    }
  }

  public delayReload() {
    if (this.browserSync) {
      setTimeout(() => {
        console.log('File changed, refreshing browser...');
        this.browserSync.reload({ stream: false });
      }, bsConf.delayReload);
    }
  }

  public reload() {
    if (this.browserSync) {
      console.log('File changed, refreshing browser...');
      this.browserSync.reload();
    }
  }
}

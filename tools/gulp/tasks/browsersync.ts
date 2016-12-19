import { BrowserSync } from '../libs/browsersync';

export = () => {
  BrowserSync.getInstance().startServer();
};

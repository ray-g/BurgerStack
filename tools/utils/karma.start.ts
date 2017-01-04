import * as karma from 'karma';
import { join } from 'path';

export const startKarma = (done: any, karmaConfig: any = {}) => {
  return new (<any>karma).Server(Object.assign({
    configFile: join(process.cwd(), 'karma.conf.js'),
    singleRun: true
  }, karmaConfig)).start(done);
};

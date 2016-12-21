import { resolve } from 'path';

process.chdir(resolve(__dirname));
// let AppServer = require(resolve('./config/libs/server'));
import { AppServer } from './config/libs/server';

AppServer.start();

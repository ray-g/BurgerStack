import * as chalk from 'chalk';
import { Databases } from './databases';
import { ExpressServer } from './express';
import { Config } from '../config';

const config = Config.config();

export class AppServer {
  private static _instance: AppServer = new AppServer();

  public static getInstance(): AppServer {
    return AppServer._instance;
  }

  public static start() {
    AppServer._instance.start();
  }

  constructor() {
    if (AppServer._instance) {
      throw new Error('Error: Instantiation failed: Use AppServer.getInstance() instead of new.');
    }
    AppServer._instance = this;
  }

  private start(): void {
    Databases.connect()
      .then(() => {
        // Initialize express
        let app = ExpressServer.init();

        app.listen(config.port, config.host, () => {
          // Create server URL
          let serverUrl = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;

          // Logging initialization
          console.log('--');
          console.log(chalk.green(config.app.title));
          console.log();
          console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
          console.log(chalk.green('Server:          ' + serverUrl));
          console.log(chalk.green('PostgreSQL:      ' + Databases.getPostgreSql().getUri()));
          console.log(chalk.green('MongoDB:         ' + config.mongodb.uri));
          console.log(chalk.green('App version:     ' + config.app.version));
          console.log('--');
        });
      })
      .catch((err) => {
        console.log(chalk.red(err));
      });
  }
}

import * as chalk from 'chalk';
import { Mongoose } from './mongoose';
import { PostgreSql } from './postgresql';
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

  private start() {
    this.init((app: any, db: any, conf: any) => {

      // Start the app by listening on <port> at <host>
      app.listen(conf.port, conf.host, () => {
        // Create server URL
        let server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + conf.host + ':' + conf.port;

        // Logging initialization
        console.log('--');
        console.log(chalk.green(conf.app.title));
        console.log();
        console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
        console.log(chalk.green('Server:          ' + server));
        console.log(chalk.green('PostgreSQL:      ' + PostgreSql.getUri()));
        console.log(chalk.green('MongoDB:         ' + conf.mongo.uri));
        console.log(chalk.green('App version:     ' + conf.app.version));
        console.log('--');
      });
    });
  }

  private init(callback: Function): void {
    PostgreSql.connect((conn: any) => {
      PostgreSql.getSequelize()
        .sync({
          force: config.postgres.sync.force
        })
        .then(() => {
          Mongoose.connect((db: any) => {
            // Initialize express
            let app = ExpressServer.init(db);
            if (callback) {
              callback(app, db, config);
            }
          });
        });
    });
  }
}

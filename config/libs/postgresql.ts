import * as path from 'path';
import * as  chalk from 'chalk';
// import * as Sequelize from 'sequelize';
import { ThirdPartyModules } from './3rd_party_modules';

import { Config } from '../config';

export class PostgreSql {
  private static _instance: PostgreSql = new PostgreSql();
  private static sequelize: any; // Sequelize.Sequelize;
  private static db: any = {};
  private static uri: string = '';

  public static getInstance(): PostgreSql {
    return PostgreSql._instance;
  }

  public static getSequelize() {
    return PostgreSql.sequelize;
  }

  // public static getDb() {
  //   return PostgreSql.db;
  // }

  public static getUri(): string {
    return PostgreSql.uri;
  }

  public static connect(connectCB: Function): Promise<any> {
    const config = Config.config();
    // Sequelize
    PostgreSql.sequelize = new (ThirdPartyModules.Sequelize())(
      config.postgres.options.database,
      config.postgres.options.username,
      config.postgres.options.password, {
        dialect: 'postgres',
        logging: config.postgres.options.logging,
        host: config.postgres.options.host,
        port: config.postgres.options.port
      });

    PostgreSql.uri = 'postgres://'
      + config.postgres.options.host + ':'
      + config.postgres.options.port + '/'
      + config.postgres.options.database;

    return new Promise((resolve, reject) => {
      PostgreSql.sequelize.authenticate().then(async (error: any) => {
        if (error) {
          console.error(chalk.red('Could not connect to PostgreSQL!'));
          console.log(error);
          reject(error);
        } else {
          await PostgreSql.sequelize
            .sync({
              force: config.postgres.sync.force
            })
            .then((db: any) => {
              resolve(db);
            })
            .catch((err: any) => {
              reject(err);
            });
        }
      });
    });
  }

  public static disconnect() {
    if (PostgreSql.sequelize) {
      PostgreSql.sequelize.close();
      PostgreSql.sequelize = undefined;
      PostgreSql.uri = '';
    }
  }

  public static loadModels() {
    const config = Config.config();
    // Import models
    config.files.server.postgresModels.forEach((modelPath: string) => {
      let model = PostgreSql.sequelize.import(path.resolve(modelPath));
      PostgreSql.db[(<any>model).name] = model;
    });

    // Associate models
    Object.keys(PostgreSql.db).forEach((modelName) => {
      if ('associate' in PostgreSql.db[modelName]) {
        PostgreSql.db[modelName].associate(PostgreSql.db);
      }
    });
  }

  constructor() {
    if (PostgreSql._instance) {
      throw new Error('Error: Instantiation failed: Use PostgreSql.getInstance() instead of new.');
    }
    PostgreSql._instance = this;
  }
}

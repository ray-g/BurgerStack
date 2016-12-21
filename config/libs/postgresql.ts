import * as path from 'path';
import * as  chalk from 'chalk';
import * as Sequelize from 'sequelize';

import { Config } from '../config';
const config = Config.config();

export class PostgreSql {
  private static _instance: PostgreSql = new PostgreSql();
  private static sequelize: Sequelize.Sequelize;
  private static db: any = {};
  private static uri: string = '';

  public static getInstance(): PostgreSql {
    return PostgreSql._instance;
  }

  public static getSequelize() {
    return PostgreSql.sequelize;
  }

  public static getDb() {
    return PostgreSql.db;
  }

  public static getUri(): string {
    return PostgreSql.uri;
  }

  public static connect(ConnectionCB: Function) {
    // Sequelize
    PostgreSql.sequelize = new Sequelize(
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

    let conn = PostgreSql.sequelize.authenticate().then((error) => {
      if (error) {
        console.error(chalk.red('Could not connect to PostgreSQL!'));
        console.log(error);
      } else if (ConnectionCB) {
        ConnectionCB(conn);
      }
    });
  }

  public static loadModels() {
    // Import models
    config.files.server.pgmodels.forEach(function (modelPath: string) {
      let model = PostgreSql.sequelize.import(path.resolve(modelPath));
      PostgreSql.db[(<any>model).name] = model;
    });

    // Associate models
    Object.keys(PostgreSql.db).forEach(function (modelName) {
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

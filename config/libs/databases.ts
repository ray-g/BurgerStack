import { Mongoose } from './mongoose';
import { PostgreSql } from './postgresql';
import { Config } from '../config';

const config = Config.config();

export class Databases {
  private static _instance: Databases = new Databases();

  public static session = require('express-session');
  public static postgresDB: any = {};
  public static mongoDB: any = {};

  public static async connect(): Promise<any> {
    await PostgreSql.connect((db: any) => {
      Databases.postgresDB = db;
    }).catch((err) => {
      console.log(err);
    });
    PostgreSql.getSequelize()
      .sync({
        force: config.postgres.sync.force
      });

    await Mongoose.connect((db: any) => {
      Databases.mongoDB = db;
    }).catch((err) => {
      console.log(err);
    });

    return new Promise((resolve, reject) => {
      switch (config.sessionStorage) {
        case 'mongodb':
          resolve(Databases.mongoDB);
          break;
        case 'postgresql':
          resolve(Databases.postgresDB);
          break;
        default:
          reject(new Error('Invalid session storage type'));
      }
    });
  }

  public static disconnect(errorHandlerCB: Function): void {

  }

  public static loadModels(callback: Function): void {

  }

  public static getSessionStore() {
    switch (config.sessionStorage) {
      case 'mongodb':
        let MongoStore = require('connect-mongo')(Databases.session);
        return new MongoStore({
          mongooseConnection: Databases.mongoDB.connection,
          collection: config.sessionCollection
        });
      case 'postgresql':
        return null;
      default:
        return new Error('Invalid session storage type');
    }

  }

  public static getPostgreSql() {
    return PostgreSql;
  }

  public static getInstance(): Databases {
    return Databases._instance;
  }

  constructor() {
    if (Databases._instance) {
      throw new Error('Error: Instantiation failed: Use Databases.getInstance() instead of new.');
    }
    Databases._instance = this;
  }
}

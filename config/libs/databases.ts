import { Mongoose } from './mongoose';
import { PostgreSql } from './postgresql';
import { Redis } from './redis';
import { Config } from '../config';

export class Databases {
  private static _instance: Databases = new Databases();

  private static session = require('express-session');
  private static postgresDB: any = {};
  private static mongoDB: any = {};
  private static redisDB: any = {};

  public static async connect(): Promise<any> {
    const config = Config.config();
    let error: any;
    await PostgreSql.connect()
      .then((db: any) => {
        Databases.postgresDB = db;
      })
      .catch((err) => {
        error = err;
        console.log(err);
      });

    if (!error) {
      await Mongoose.connect()
        .then((db: any) => {
          Databases.mongoDB = db;
        }).catch((err) => {
          error = err;
          console.log(err);
        });
    }

    if (!error) {
      await Redis.connect()
        .then((db: any) => {
          Databases.redisDB = db;
        }).catch((err) => {
          error = err;
          console.log(err);
        });
    }

    return new Promise((resolve, reject) => {
      if (error) {
        reject(error);
      } else {
        switch (config.sessionStorage) {
          case 'mongodb':
            resolve(Databases.mongoDB);
            break;
          case 'postgresql':
            resolve(Databases.postgresDB);
            break;
          case 'redis':
            resolve(Databases.redisDB);
            break;
          default:
            reject(new Error('Invalid session storage type'));
        }
      }
    });
  }

  public static disconnect(errorHandlerCB: Function): void {
    Redis.disconnect();
    Mongoose.disconnect(null);
    PostgreSql.disconnect();
    if (errorHandlerCB) {
      errorHandlerCB();
    }
  }

  public static loadModels(): void {
    PostgreSql.loadModels();
    Mongoose.loadModels(null);
  }

  public static getSessionStore() {
    const config = Config.config();
    switch (config.sessionStorage) {
      case 'mongodb':
        let MongoStore = require('connect-mongo')(Databases.session);
        return new MongoStore({
          mongooseConnection: Databases.mongoDB.connection,
          collection: config.sessionStoreName
        });
      case 'postgresql':
        let SequelizeStore = require('connect-session-sequelize')(Databases.session.Store);
        let sequelizeStore = new SequelizeStore({
          db: Databases.postgresDB
        });
        // sequelizeStore.sync();
        return sequelizeStore;
      case 'redis':
        let RedisStore = require('connect-redis')(Databases.session);
        let redisStore = new RedisStore({
          client: Databases.redisDB
        });
        return redisStore;
      default:
        throw new Error('Invalid session storage type');
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

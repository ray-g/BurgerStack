import { Mongoose } from './mongoose';
import { PostgreSql } from './postgresql';
import { Config } from '../config';

let session = require('express-session');
let MongoStore = require('connect-mongo')(session);

const config = Config.config();

export class Databases {
  private static _instance: Databases = new Databases();

  public static session = require('express-session');

  public static connect(connectCB: Function): void {
    PostgreSql.connect((conn: any) => {
      PostgreSql.getSequelize()
        .sync({
          force: config.postgres.sync.force
        })
        .then(() => {
          Mongoose.connect((db: any) => {
            if (connectCB) {
              connectCB(db);
            }
          });
        });
    });
  }

  public static disconnect(errorHandlerCB: Function): void {

  }

  public static loadModels(callback: Function): void {

  }

  public static getSessionStore(db: any) {
    return new MongoStore({
        mongooseConnection: db.connection,
        collection: config.sessionCollection
      });
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

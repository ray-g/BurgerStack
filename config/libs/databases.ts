import { Mongoose } from './mongoose';
import { PostgreSql } from './postgresql';
import { Config } from '../config';

const config = Config.config();

export class Databases {
  private static _instance: Databases = new Databases();

  public static session = require('express-session');

  public static connect(ConnectCB: Function): void {

  }

  public static disconnect(errorHandlerCB: Function): void {

  }

  public static loadModels(callback: Function): void {

  }

  public static getSessionStore() {

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

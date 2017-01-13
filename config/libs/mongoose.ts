import * as chalk from 'chalk';
import * as path from 'path';
import * as mongoose from 'mongoose';
(<any>mongoose).Promise = Promise;

import { Config } from '../config';

// The mongoose singleton /**
export class Mongoose {
  private static _instance: Mongoose = new Mongoose();
  private static debug = false;
  private static connected = false;

  public static getInstance(): Mongoose {
    return Mongoose._instance;
  }

  public static loadModels(callback: Function): void {
    const config = Config.config();
    config.files.server.runtime.mongodbModels.forEach((modelPath: string) => {
      require(path.resolve(modelPath));
    });

    if (callback) {
      callback();
    }
  }

  public static connect(): Promise<any> {
    const config = Config.config();
    Mongoose.debug = config.mongodb.debug;
    return new Promise((resolve, reject) => {
      let db = mongoose.connect(config.mongodb.uri, config.mongodb.options);
      db.then(() => {
        // Enabling mongoose debug mode if required
        mongoose.set('debug', config.mongodb.debug);
        Mongoose.connected = true;
        resolve(db);
      }).catch((err: any) => {
        if (err) {
          console.error(chalk.red('Could not connect to MongoDB!'));
          reject(err);
        }
      });
    });
  };

  public static disconnect(errorHandlerCB: Function): void {
    if (Mongoose.connected) {
      mongoose.disconnect((error: any) => {
        Mongoose.connected = false;
        if (Mongoose.debug) {
          console.log(chalk.yellow('Disconnected from MongoDB.'));
        }
        if (error && errorHandlerCB) {
          errorHandlerCB(error);
        }
      });
    }
  };

  constructor() {
    if (Mongoose._instance) {
      throw new Error('Error: Instantiation failed: Use Mongoose.getInstance() instead of new.');
    }
    Mongoose._instance = this;
  }
}

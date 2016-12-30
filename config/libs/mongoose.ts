import * as chalk from 'chalk';
import * as path from 'path';
import * as mongoose from 'mongoose';
(<any>mongoose).Promise = global.Promise;

import { Config } from '../config';

const config = Config.config();

// The mongoose singleton /**
export class Mongoose {
  private static _instance: Mongoose = new Mongoose();

  public static getInstance(): Mongoose {
    return Mongoose._instance;
  }

  public static loadModels(callback: Function): void {
    config.files.server.runtime.mongodbModels.forEach((modelPath: string) => {
      require(path.resolve(modelPath));
    });

    if (callback) {
      callback();
    }
  }

  public static connect(connectCB: Function): Promise<any> {
    return new Promise((resolve, reject) => {
      let db = mongoose.connect(config.mongodb.uri, config.mongodb.options, (err) => {
        // Log Error
        if (err) {
          console.error(chalk.red('Could not connect to MongoDB!'));
          reject(err);
        } else {
          // Enabling mongoose debug mode if required
          mongoose.set('debug', config.mongodb.debug);
          if (connectCB) {
            connectCB(db);
          }
          resolve(db);
        }
      });
    });
  }

  public static disconnect(errorHandlerCB: Function): void {
    mongoose.disconnect((error) => {
      console.log(chalk.yellow('Disconnected from MongoDB.'));
      errorHandlerCB(error);
    });
  }

  constructor() {
    if (Mongoose._instance) {
      throw new Error('Error: Instantiation failed: Use Mongoose.getInstance() instead of new.');
    }
    Mongoose._instance = this;
  }
}

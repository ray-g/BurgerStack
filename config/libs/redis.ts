import * as redis from 'redis';
import { Config } from '../config';
const config = Config.config();

export class Redis {
  private static _instance: Redis = new Redis();

  private client: any = {};

  public static getInstance(): Redis {
    return Redis._instance;
  }

  public static connect(connectCB: Function) {
    return Redis.getInstance().connect(connectCB);
  }

  public static disconnect() {
    Redis.getInstance().disconnect();
  }

  public static getClient() {
    return Redis.getInstance().getClient();
  }

  constructor() {
    if (Redis._instance) {
      throw new Error('Error: Instantiation failed: Use Redis.getInstance() instead of new.');
    }
    Redis._instance = this;
  }

  private connect(connectCB: Function): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client = redis.createClient(config.redis.uri, config.redis.options);
      if (config.redis.auth.enabled) {
        this.client.auth(config.redis.auth.pass);
      }

      this.client.on('error', (err: any) => {
        reject(err);
      });

      this.client.on('ready', () => {
        if (connectCB) {
          connectCB(this.client);
        }
        resolve(this.client);
      });
    });
  }

  private disconnect() {
    this.client.quit();
  }

  private getClient() {
    return this.client;
  }
}

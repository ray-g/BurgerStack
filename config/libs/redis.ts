import * as redis from 'redis';
import { Config } from '../config';

export class Redis {
  private static _instance: Redis = new Redis();

  private client: any = undefined;

  public static getInstance(): Redis {
    return Redis._instance;
  }

  public static connect() {
    return Redis.getInstance().connect();
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

  private connect(): Promise<any> {
    const config = Config.config();
    return new Promise((resolve, reject) => {
      if (this.client) {
        resolve(this.client);
      } else {
        this.client = redis.createClient(config.redis.uri, config.redis.options);
        if (config.redis.auth.enabled) {
          this.client.auth(config.redis.auth.pass);
        }
      }

      this.client.on('error', (err: any) => {
        reject(err);
      });

      this.client.on('ready', () => {
        resolve(this.client);
      });
    });
  }

  private disconnect() {
    if (this.client) {
      this.client.quit();
      this.client = undefined;
    }
  }

  private getClient() {
    return this.client;
  }
}

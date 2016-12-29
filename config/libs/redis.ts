import * as redis from 'redis';

export class Redis {
  private static _instance: Redis = new Redis();

  public static getInstance(): Redis {
    return Redis._instance;
  }

  constructor() {
     if (Redis._instance) {
      throw new Error('Error: Instantiation failed: Use Redis.getInstance() instead of new.');
    }
  Redis._instance = this;
  }
}

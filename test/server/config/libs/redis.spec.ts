import { expect, assert } from 'chai';
let sinon = require('sinon');
require('sinon-as-promised');

import * as redis from 'redis';
import { Config } from '../../../../config/config';

import { Redis } from '../../../../config/libs/redis';

describe('Redis class', () => {
  let redisClient: any;
  let config: any;

  let stubs: any[] = [];

  beforeEach(() => {
    config = {
      redis: {
        auth: {
          enabled: false,
          pass: 'changeme'
        }
      }
    };
    redisClient = {
      auth: sinon.spy(),
      on: (event: string, cb: Function) => { cb(); },
      quit: sinon.spy()
    };
    stubs.push(sinon.stub(redis, 'createClient').returns(redisClient));
    stubs.push(sinon.stub(Config, 'config').returns(config));
  });

  afterEach(() => {
    stubs.forEach((stub) => {
      stub.restore();
    });
    stubs = [];

    Redis.disconnect();
  });

  describe('Singleton staffs', () => {
    it('.getInstance(), should return an Redis instance.', () => {
      expect(Redis.getInstance()).instanceOf(Redis);
    });

    it('new Config instance should get an error', () => {
      expect(() => { new Redis(); }).throws('Error: Instantiation failed: Use Redis.getInstance() instead of new.');
    });
  });

  describe('.connect', () => {
    it('should call auth if auth is enabled', () => {
      config.redis.auth.enabled = true;
      Redis.connect(null);
      assert(redisClient.auth.called);
    });

    it('should invoke callback if provided', () => {
      let cb = sinon.spy();
      Redis.connect(cb);
      assert(cb.withArgs(redisClient).called);
    });
  });

  describe('.disconnect', () => {
    it('should call redis client quit', () => {
      Redis.connect(null);
      Redis.disconnect();
      assert(redisClient.quit.called);
    });

    it('should not call redis client quit if not connected', () => {
      Redis.disconnect();
      assert(!redisClient.quit.called);
    });
  });

  describe('.getClient', () => {
    it('should return redis client', () => {
      Redis.connect(null);
      expect(Redis.getClient()).to.equal(redisClient);
    });

    it('should get undefined if Redis is not connected', () => {
      expect(Redis.getClient()).to.equal(undefined);
    });

    it('should get {} if Redis is disconnected', () => {
      Redis.connect(null);
      Redis.disconnect();
      expect(Redis.getClient()).to.equal(undefined);
    });
  });
});

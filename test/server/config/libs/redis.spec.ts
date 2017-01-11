import { expect } from 'chai';
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
    redisClient = {
    };
    stubs.push(sinon.stub(redis, 'createClient').returns(redisClient));
    stubs.push(sinon.stub(Config, 'config').returns(config));
  });

  afterEach(() => {
    stubs.forEach((stub) => {
      stub.restore();
    });
    stubs = [];
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

    });

    it('should reject with error if on("error")', () => {

    });

    it('should invoke callback if provided', () => {

    });

    it('should resolve with redis client if success', () => {

    });
  });

  describe('.disconnect', () => {
    it('should call redis client quit', () => {

    });
  });

  describe('.getClient', () => {
    it('should return redis client', () => {

    });
  });
});

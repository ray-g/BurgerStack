import { assert, expect } from 'chai';
let sinon = require('sinon');
require('sinon-as-promised');
let mockRequire = require('mock-require');

let expressSessionMock = { Store: {} };
mockRequire('express-session', expressSessionMock);

class MongoStoreMock {
}
class PostgreStoreMock {
}
class RedisStoreMock {
}
let connectMongoStub = sinon.stub().returns(MongoStoreMock);
let connectRedisStub = sinon.stub().returns(RedisStoreMock);
let connectSequelizeStub = sinon.stub().returns(PostgreStoreMock);
mockRequire('connect-mongo', connectMongoStub);
mockRequire('connect-redis', connectRedisStub);
mockRequire('connect-session-sequelize', connectSequelizeStub);

import { Config } from '../../../../config/config';
import { Redis } from '../../../../config/libs/redis';
import { PostgreSql } from '../../../../config/libs/postgresql';
import { Mongoose } from '../../../../config/libs/mongoose';
import { Databases } from '../../../../config/libs/databases';

describe('Databases class', () => {
  let stubs: any[] = [];
  let config: any = {};
  let mongoConnStub: any;
  let postgreConnStub: any;
  let redisConnStub: any;
  let mongoDBMock: any = {};
  let postgreDBMock: any = {};
  let redisDBMock: any = {};
  let errMock = new Error('fake error msg');

  beforeEach(() => {
    config = {
      sessionStorage: 'someStorage', // Available: 'mongodb', 'postgresql', 'redis'
      sessionStoreName: 'BurgerStackSessions'
    };
    stubs.push(sinon.stub(Config, 'config').returns(config));

    mongoConnStub = sinon.stub(Mongoose, 'connect');
    postgreConnStub = sinon.stub(PostgreSql, 'connect');
    redisConnStub = sinon.stub(Redis, 'connect');
    stubs.push(mongoConnStub);
    stubs.push(postgreConnStub);
    stubs.push(redisConnStub);
  });

  afterEach(() => {
    Databases.disconnect(null);
    stubs.forEach((stub) => {
      stub.restore();
    });
    stubs = [];
  });

  describe('Singleton staffs', () => {
    it('.getInstance(), should return an Databases instance.', () => {
      expect(Databases.getInstance()).instanceOf(Databases);
    });

    it('new Databases instance should get an error', () => {
      expect(() => { new Databases(); }).throws('Error: Instantiation failed: Use Databases.getInstance() instead of new.');
    });
  });

  describe('.loadModels', () => {
    it('should invoke PostgreSql and Mongoose loadModels', () => {
      let pgLoadModelsStub = sinon.stub(PostgreSql, 'loadModels', () => { });
      let mgLoadModelsStub = sinon.stub(Mongoose, 'loadModels', () => { });

      Databases.loadModels();

      assert(pgLoadModelsStub.called);
      assert(mgLoadModelsStub.called);

      pgLoadModelsStub.restore();
      mgLoadModelsStub.restore();
    });
  });

  describe('.getPostgreSql', () => {
    it('should return PostgreSql class', () => {
      expect(Databases.getPostgreSql()).to.equal(PostgreSql);
    });
  });

  describe('.disconnect', () => {
    let pDisconnectStub: any;
    let mDisconnectStub: any;
    let rDisconnectStub: any;

    beforeEach(() => {
      pDisconnectStub = sinon.stub(PostgreSql, 'disconnect', () => { });
      mDisconnectStub = sinon.stub(Mongoose, 'disconnect', () => { });
      rDisconnectStub = sinon.stub(Redis, 'disconnect', () => { });
    });

    afterEach(() => {
      pDisconnectStub.restore();
      mDisconnectStub.restore();
      rDisconnectStub.restore();
    });

    it('should invoke all DB\'s disconnect', () => {
      Databases.disconnect(null);

      assert(pDisconnectStub.called);
      assert(mDisconnectStub.called);
      assert(rDisconnectStub.called);
    });

    it('should invoke callback if provided', () => {
      let cbSpy = sinon.spy();
      Databases.disconnect(cbSpy);
      assert(cbSpy.called);
    });
  });

  describe('.connect', () => {
    beforeEach(() => {
      postgreConnStub.resolves(postgreDBMock)();
      mongoConnStub.resolves(mongoDBMock)();
      redisConnStub.resolves(redisDBMock)();
    });

    it('should reject with error if mongodb failed to connect', async () => {
      mongoConnStub.rejects(errMock)();
      let logStub = sinon.stub(console, 'log', () => { });
      await Databases.connect()
        .then(() => {
          assert(false);
        })
        .catch((err) => {
          expect(err).to.equal(errMock);
        });
      logStub.restore();
    });

    it('should reject with error if postgre failed to connect', async () => {
      postgreConnStub.rejects(errMock)();
      let logStub = sinon.stub(console, 'log', () => { });
      await Databases.connect()
        .then(() => {
          assert(false);
        })
        .catch((err) => {
          expect(err).to.equal(errMock);
        });
      logStub.restore();
    });

    it('should reject with error if redis failed to connect', async () => {
      redisConnStub.rejects(errMock)();
      let logStub = sinon.stub(console, 'log', () => { });
      await Databases.connect()
        .then(() => {
          assert(false);
        })
        .catch((err) => {
          expect(err).to.equal(errMock);
        });
      logStub.restore();
    });

    it('should resolve mongodb if successfully connected and use mongodb as session store', async () => {
      config.sessionStorage = 'mongodb';
      await Databases.connect()
        .then((db) => {
          expect(db).to.equal(mongoDBMock);
        })
        .catch(() => {
          assert(false);
        });
    });

    it('should resolve posrgresdb if successfully connected and use postgres as session store', async () => {
      config.sessionStorage = 'postgresql';
      await Databases.connect()
        .then((db) => {
          expect(db).to.equal(postgreDBMock);
        })
        .catch(() => {
          assert(false);
        });
    });

    it('should resolve redisdb if successfully connected and use redis as session store', async () => {
      config.sessionStorage = 'redis';
      await Databases.connect()
        .then((db) => {
          expect(db).to.equal(redisDBMock);
        })
        .catch(() => {
          assert(false);
        });
    });

    it('should rejects error if config.sessionStorage is not recognized', async () => {
      config.sessionStorage = 'sth else';
      await Databases.connect()
        .then(() => {
          assert(false);
        })
        .catch((err) => {
          expect(err).deep.equal(new Error('Invalid session storage type'));
        });
    });
  });

  describe('.getSessionStore', () => {
    it('should rejects error if config.sessionStorage is not recognized', () => {
      expect(() => { Databases.getSessionStore(); }).throws('Invalid session storage type');
    });

    it('should return mongoStore if use mongo as session storage', () => {
      config.sessionStorage = 'mongodb';
      let storage = Databases.getSessionStore();
      expect(storage).instanceOf(MongoStoreMock);
    });

    it('should return redisStore if use redis as session storage', () => {
      config.sessionStorage = 'redis';
      let storage = Databases.getSessionStore();
      expect(storage).instanceOf(RedisStoreMock);
    });

    it('should return postgreStore if use posrgresql as session storage', () => {
      config.sessionStorage = 'postgresql';
      let storage = Databases.getSessionStore();
      expect(storage).instanceOf(PostgreStoreMock);
    });
  });
});

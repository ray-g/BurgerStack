import { expect, assert } from 'chai';
let sinon = require('sinon');
require('sinon-as-promised');
let mockRequire = require('mock-require');
import { resolve } from 'path';
import * as mongoose from 'mongoose';
import { Config } from '../../../../config/config';
import { Mongoose } from '../../../../config/libs/mongoose';

describe('Mongoose class', () => {
  let stubs: any[] = [];
  let config: any;
  let errMock: any;
  let dbMock: any = {};
  let dbPromise: any;
  let mongoConnStub: any;
  let mongoDisConnStub: any;

  beforeEach(() => {
    errMock = undefined;
    config = {
      files: {
        server: {
          mongodbModels: []
        }
      },
      mongodb: {
        uri: 'mongoUri',
        options: {}
      }
    };

    dbPromise = new Promise((resolve, reject) => {
      if (errMock) {
        reject(errMock);
      } else {
        resolve(dbMock);
      }
    });

    mongoConnStub = sinon.stub(mongoose, 'connect').returns(dbPromise);
    mongoDisConnStub = sinon.stub(mongoose, 'disconnect', (cb: Function) => { cb(errMock); });
    stubs.push(mongoConnStub);
    stubs.push(mongoDisConnStub);
    stubs.push(sinon.stub(Config, 'config').returns(config));
    stubs.push(sinon.stub(mongoose, 'set'));
  });

  afterEach(() => {
    Mongoose.disconnect(null);
    stubs.forEach((stub) => {
      stub.restore();
    });
    stubs = [];
  });

  describe('Singleton staffs', () => {
    it('.getInstance(), should return an Mongoose instance.', () => {
      expect(Mongoose.getInstance()).instanceOf(Mongoose);
    });

    it('new Mongoose instance should get an error', () => {
      expect(() => { new Mongoose(); }).throws('Error: Instantiation failed: Use Mongoose.getInstance() instead of new.');
    });
  });

  describe('.connect', () => {
    it('should reject with error if any error occured', async () => {
      errMock = new Error('fake error msg');
      dbPromise = new Promise((resolve, reject) => {
        if (errMock) {
          reject(errMock);
        } else {
          resolve(dbMock);
        }
      });
      mongoConnStub.restore();
      mongoConnStub = sinon.stub(mongoose, 'connect').returns(dbPromise);
      let errStub = sinon.stub(console, 'error', () => { });
      await Mongoose.connect()
        .catch((err) => {
          expect(err).to.equals(errMock);
        });
      errStub.restore();
    });

    it('should resolve mongodb connection after connected', async () => {
      await Mongoose.connect()
        .then((db: any) => {
          expect(db).deep.equals(dbMock);
        });
    });
  });

  describe('.loadModels', () => {
    it('should invoke callback if provided', () => {
      let cbSpy = sinon.spy();
      Mongoose.loadModels(cbSpy);
      assert(cbSpy.called);
    });

    it('should load models', () => {
      config.files.server.mongodbModels = ['path.to.model'];
      mockRequire(resolve('path.to.model'));
      Mongoose.loadModels(null);
      assert(true);
    });
  });

  describe('.disconnect', () => {
    it('should invoke mongoose.disconnect after connected', async () => {
      await Mongoose.connect();
      Mongoose.disconnect(null);
      assert(mongoDisConnStub.called);
    });

    it('should not invoke mongoose.disconnect if not connected', () => {
      Mongoose.disconnect(null);
      assert(!mongoDisConnStub.called);
    });

    it('should log error if debug', async () => {
      config.mongodb.debug = true;
      let logStub = sinon.stub(console, 'log', () => { });
      await Mongoose.connect();
      Mongoose.disconnect(null);
      logStub.restore();
      assert(logStub.called);
    });

    it('should invoke error handler cb if provided and error occurs', async () => {
      errMock = new Error('fake err msg');
      await Mongoose.connect();
      let cbSpy = sinon.spy();
      Mongoose.disconnect(cbSpy);
      assert(cbSpy.called);
    });
  });
});

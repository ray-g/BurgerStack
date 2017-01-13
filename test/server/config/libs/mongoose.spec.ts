import { expect, assert } from 'chai';
let sinon = require('sinon');
require('sinon-as-promised');

import * as mongoose from 'mongoose';
import { Mongoose } from '../../../../config/libs/mongoose';

describe('Mongoose class', () => {
  let stubs: any[] = [];
  let config: any;
  let errMock: any;
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

    mongoConnStub = sinon.stub(mongoose, 'connect',
      (uri: string, options: any, cb: Function) => {
        if (errMock) {
          cb(errMock);
        } else {
          // cb(null);
        }
      });
    mongoDisConnStub = sinon.stub(mongoose, 'disconnect');
    stubs.push(mongoConnStub);
    stubs.push(mongoDisConnStub);
    stubs.push(sinon.stub(mongoose, 'set'));
  });

  afterEach(() => {
    stubs.forEach((stub) => {
      stub.restore();
    });
    stubs = [];
    Mongoose.disconnect(null);
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
      let errStub = sinon.stub(console, 'error', () => { });
      await Mongoose.connect(null)
        .catch((err) => {
          expect(err).to.equals(errMock);
          errStub.restore();
        });
    });

    it('should invoke callback after connected if callback provided', async () => {
      // await Mongoose.connect((db: any) => {
      //   console.log(db);
      // })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    });
  });

  describe('.loadModels', () => {

  });

  describe('disconnect', () => {
    it('should invoke mongoose.disconnect after connected', async () => {
      // await Mongoose.connect(null);
      // Mongoose.disconnect(null);
      // assert(mongoDisConnStub.called);
    });

    it('should not invoke mongoose.disconnect if not connected', () => {
      Mongoose.disconnect(null);
      assert(!mongoDisConnStub.called);
    });
  });
});

import { expect } from 'chai';
let sinon = require('sinon');
require('sinon-as-promised');

import { Databases } from '../../../../config/libs/databases';
import { ExpressServer } from '../../../../config/libs/express';

import { AppServer } from '../../../../config/libs/server';

describe('AppServer class', () => {
  let logStub: any;
  let errStub: any;

  function stubOutput() {
    logStub = sinon.stub(console, 'log', () => { });
    errStub = sinon.stub(console, 'error', () => { });
  };

  function restoreOutput() {
    logStub.restore();
    errStub.restore();
  };

  let stubs: any[] = [];

  afterEach(() => {
    stubs.forEach((stub) => {
      stub.restore();
    });
    stubs = [];
  });

  describe('Singleton staffs', () => {
    it('.getInstance(), should return an AppServer instance.', () => {
      expect(AppServer.getInstance()).instanceOf(AppServer);
    });

    it('new Config instance should get an error', () => {
      expect(() => { new AppServer(); }).throws('Error: Instantiation failed: Use AppServer.getInstance() instead of new.');
    });
  });

  describe('.start', () => {
    function mockDBConn() {
      return {
        then: (connCB: Function) => {
          connCB();
          return {
            catch: (errCB: Function) => { errCB(); }
          };
        }
      };
    }

    function mockExpressServerInit() {
      return {
        listen: (port: number, host: number, foo: Function) => { foo(); }
      };
    }

    it('should work properly with non Secure NODE_ENV', () => {
      stubOutput();
      stubs.push(sinon.stub(Databases, 'connect', mockDBConn));
      stubs.push(sinon.stub(ExpressServer, 'init', mockExpressServerInit));

      AppServer.start();
      expect(logStub.called);
      restoreOutput();
    });

    it('should work properly with "secure" NODE_ENV', () => {
      stubOutput();
      let currentEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'secure';
      stubs.push(sinon.stub(Databases, 'connect', mockDBConn));
      stubs.push(sinon.stub(ExpressServer, 'init', mockExpressServerInit));

      AppServer.start();
      expect(logStub.called);
      process.env.NODE_ENV = currentEnv;
      restoreOutput();
    });

    it('should log error when failed to connect DB', () => {
      stubOutput();
      stubs.push(sinon.stub(Databases, 'connect', mockDBConn));
      stubs.push(sinon.stub(ExpressServer, 'init', mockExpressServerInit));

      AppServer.start();
      expect(errStub.called);
      restoreOutput();
    });
  });
});

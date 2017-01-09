import { expect } from 'chai';
import sinon = require('sinon');

import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import * as utils from '../../../config/utils/common';
let mockRequire = require('mock-require');

import { Config } from '../../../config/config';

describe('Config class', () => {
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
    it('.getInstance(), should return an Config instance.', () => {
      expect(Config.getInstance()).instanceOf(Config);
    });

    it('.config(), should return an object, not a Config instance.', () => {
      expect(Config.config()).instanceOf(Object);
      expect(Config.config()).not.instanceOf(Config);
    });

    it('.getInstance().getConfig() should the same as Config.config()', () => {
      expect(Config.config()).deep.equal(Config.getInstance().getConfig());
    });

    it('new Config instance should get an error', () => {
      expect(() => { new Config(); }).throws('Error: Instantiation failed: Use Config.getInstance() instead of new.');
    });
  });

  describe('test private methods', () => {
    let config = (<any>Config.getInstance());
    describe('private #validateEnvironmentVariable', () => {
      it('should change NODE_ENV to "development" if no envrionemnt file found ', () => {
        stubOutput();
        stubs.push(sinon.stub(glob, 'sync').returns([]));
        let currentEnv = process.env.NODE_ENV;

        config.validateEnvironmentVariable();

        expect(errStub.calledOnce);
        restoreOutput();

        expect(process.env.NODE_ENV).equal('development');

        process.env.NODE_ENV = currentEnv;
      });

      it('should change NODE_ENV to "development" if NODE_ENV is not set', () => {
        stubOutput();
        let currentEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = '';

        config.validateEnvironmentVariable();

        expect(errStub.calledOnce);
        restoreOutput();

        expect(process.env.NODE_ENV).equal('development');

        process.env.NODE_ENV = currentEnv;
      });
    });

    describe('private #validateSecureMode', () => {

      it('should return true if config.secure is not set', () => {
        expect(config.validateSecureMode({})).to.be.true;
      });

      it('should return true if config.secure.ssl is not true', () => {
        expect(config.validateSecureMode({ secure: {} })).to.be.true;
        expect(config.validateSecureMode({ secure: { ssl: false } })).to.be.true;
        expect(config.validateSecureMode({ secure: { ssl: 'false' } })).to.be.true;
        expect(config.validateSecureMode({ secure: { ssl: 'true' } })).to.be.true;
        expect(config.validateSecureMode({ secure: { ssl: '' } })).to.be.true;
      });

      it('should return true if ssl is set and certs are ok', () => {
        stubs.push(sinon.stub(path, 'resolve').returns(''));
        stubs.push(sinon.stub(fs, 'existsSync').returns(true));
        expect(config.validateSecureMode({ secure: { ssl: true } })).to.be.true;
      });

      it('should return false if ssl is set but cert not exists, and log error', () => {
        stubOutput();
        stubs.push(
          sinon.stub(path, 'resolve').returns(''));
        stubs.push(
          sinon.stub(fs, 'existsSync').returns(false));

        let ret = config.validateSecureMode({ secure: { ssl: true } });
        expect(errStub.calledOnce);
        restoreOutput();

        expect(ret).to.equal(false);
      });
    });

    describe('private #validateSessionSecret', () => {
      it('should return true if NODE_ENV is not "production"', () => {
        let currentEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'test';

        expect(config.validateSessionSecret({}, true)).to.be.true;

        process.env.NODE_ENV = currentEnv;
      });

      it('should return true if NODE_ENV is "production" and not using the default sessionSecret', () => {
        let currentEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';

        expect(config.validateSessionSecret({ sessionSecret: 'secret' }, true)).to.be.true;

        process.env.NODE_ENV = currentEnv;
      });

      it('should return false without log error if NODE_ENV is "production" but using the default sessionSecret and testing', () => {
        stubOutput();
        let currentEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';

        let ret = config.validateSessionSecret({ sessionSecret: 'BurgerStack' }, true);
        expect(logStub.notCalled);
        restoreOutput();

        expect(ret).to.be.false;
        process.env.NODE_ENV = currentEnv;
      });

      it('should return false and log error if NODE_ENV is "production" but using the default sessionSecret and not testing', () => {
        stubOutput();
        let currentEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';

        let ret = config.validateSessionSecret({ sessionSecret: 'BurgerStack' }, false);
        expect(logStub.called);
        restoreOutput();

        expect(ret).to.be.false;
        process.env.NODE_ENV = currentEnv;
      });
    });

    describe('private #initGlobalConfig', () => {
      it('should not merge local env if it not exists', () => {
        stubOutput();
        let mergeSpy = sinon.spy(_, 'merge');
        stubs.push(mergeSpy);
        stubs.push(sinon.stub(fs, 'existsSync').returns(false));
        stubs.push(sinon.stub(utils, 'getGlobbedPaths').returns(['aa']));

        config.initGlobalConfig();
        restoreOutput();

        expect(mergeSpy.calledWithExactly(2));
      });

      it('should not merge local env if there are too many', () => {
        stubOutput();
        let mergeSpy = sinon.spy(_, 'merge');
        stubs.push(mergeSpy);
        stubs.push(sinon.stub(fs, 'existsSync').returns(false));
        stubs.push(sinon.stub(utils, 'getGlobbedPaths').returns(['aa', 'bb']));

        config.initGlobalConfig();
        restoreOutput();

        expect(mergeSpy.calledWithExactly(2));
      });

      it('should not merge local env if there is none', () => {
        stubOutput();
        let mergeSpy = sinon.spy(_, 'merge');
        stubs.push(mergeSpy);
        stubs.push(sinon.stub(utils, 'getGlobbedPaths').returns([]));

        config.initGlobalConfig();
        restoreOutput();

        expect(mergeSpy.calledWithExactly(2));
      });

      it('should use default {} to merge if require failed', () => {
        stubOutput();
        let mergeSpy = sinon.spy(_, 'merge');
        stubs.push(mergeSpy);
        stubs.push(sinon.stub(utils, 'getGlobbedPaths').returns(['aa']));
        stubs.push(sinon.stub(fs, 'existsSync').returns(true));
        mockRequire('aa');
        let currentEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';
        mockRequire(path.join(process.cwd(), 'config/assets/development'));
        mockRequire(path.join(process.cwd(), 'config/env/development'));

        config.initGlobalConfig();

        restoreOutput();

        expect(mergeSpy.getCall(0).args[1]).deep.equal({});
        expect(mergeSpy.getCall(1).args[1]).deep.equal({});
        expect(mergeSpy.getCall(2).args[1]).deep.equal({});
        process.env.NODE_ENV = currentEnv;
      });
    });
  });

});

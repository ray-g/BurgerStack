import { expect, assert } from 'chai';
let sinon = require('sinon');

import * as fs from 'fs';
import { Config } from '../../../../config/config';
import { Logger } from '../../../../config/libs/logger';

describe('Logger', () => {
  let logStub: any;
  let errStub: any;
  let config: any;

  function stubOutput() {
    logStub = sinon.stub(console, 'log', () => { });
    errStub = sinon.stub(console, 'error', () => { });
  };

  function restoreOutput() {
    logStub.restore();
    errStub.restore();
  };

  let stubs: any[] = [];

  beforeEach(() => {
    config = {
      log: {
        format: 'dev',
        fileLogger: {
          directoryPath: process.cwd(),
          fileName: 'test.log',
          maxsize: 10485760,
          maxFiles: 2,
          json: false
        },
        // true: Only log to file.
        // false: Log to both file and console.
        fileOnly: true
      }
    };
    stubs.push(sinon.stub(Config, 'config').returns(config));
  });

  afterEach(() => {
    stubs.forEach((stub) => {
      stub.restore();
    });
    stubs = [];
  });

  describe('.stream', () => {
    it('should return a write function', () => {
      let infoStub = sinon.stub(Logger, 'info', () => { });

      Logger.stream.write('some log');

      assert(infoStub.withArgs('some log').called);
    });
  });

  describe('.setupFileLogger', () => {
    it('should return false if log options is not right', () => {
      stubs.push(sinon.stub(Logger, 'getLogOptions').returns(false));
      assert(!Logger.setupFileLogger({}));
    });

    it('should not remove winston console log if fileOnly is false', () => {
      stubs.push(sinon.stub(fs, 'openSync').returns(false));
      config.log.fileOnly = false;
      let removeSpy = sinon.spy(Logger, 'remove');
      assert(Logger.setupFileLogger({}));
      assert(!removeSpy.called);
      removeSpy.restore();
    });

    it('should log error and return false if error occured and not in test mode', () => {
      let nodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'nottest';

      stubs.push(sinon.stub(fs, 'openSync').throws('sth wrong'));
      stubOutput();
      assert(!Logger.setupFileLogger({}));
      restoreOutput();
      process.env.NODE_ENV = nodeEnv;
    });

    it('should only return false if error occured and in test mode', () => {
      stubs.push(sinon.stub(fs, 'openSync').throws('sth wrong'));
      assert(!Logger.setupFileLogger({}));
    });
  });

  describe('.getLogOptions', () => {
    it('should override config if param is set and return false if path and name is not set', () => {
      stubOutput();
      assert(!Logger.getLogOptions({ log: { fileLogger: {} } }));
      restoreOutput();
    });

    it('should use default setting if maxsize, maxfile and json is not set', () => {
      config.log.fileLogger = {
        directoryPath: process.cwd(),
        fileName: 'test.log'
      };
      assert(Logger.getLogOptions(null));
    });
  });

  describe('.getMorganOptions', () => {
    it('should return Logger.stream', () => {
      let option = Logger.getMorganOptions();
      expect(option.stream).to.equal(Logger.stream);
    });
  });

  describe('.getLogFormat', () => {
    it('should return correct formats if config is write', () => {
      const VALID_FORMATS = ['combined', 'common', 'dev', 'short', 'tiny'];
      VALID_FORMATS.forEach((format: string) => {
        config.log.format = format;
        let logFormat = Logger.getLogFormat();
        expect(logFormat).to.equal(format);
      });
    });

    it('should return "combined" if log format is not set', () => {
      config.log = undefined;
      let format = Logger.getLogFormat();
      expect(format).to.equal('combined');
    });

    it('should return "combined" if log format is not valid', () => {
      config.log.format = 'not valid';
      let format = Logger.getLogFormat();
      expect(format).to.equal('combined');
    });

    it('should return "combined" if log format is not valid and log it if NODE_ENV is not "test"', () => {
      config.log.format = 'not valid';

      let nodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'nottest';
      stubOutput();
      let format = Logger.getLogFormat();
      restoreOutput();
      process.env.NODE_ENV = nodeEnv;
      expect(format).to.equal('combined');
    });
  });
});

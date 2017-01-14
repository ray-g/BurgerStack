import { expect } from 'chai';
let sinon = require('sinon');
require('sinon-as-promised');
let mockRequire = require('mock-require');
import { ThirdPartyModules } from '../../../../config/libs/3rd_party_modules';
import * as _ from 'lodash';

import * as fs from 'fs';
import { resolve } from 'path';
import { SocketIO } from '../../../../config/libs/socket.io';
import { Databases } from '../../../../config/libs/databases';
import { Config } from '../../../../config/config';

import { ExpressServer } from '../../../../config/libs/express';

describe('ExpressServer class', () => {
  let stubs: any[] = [];

  let logStub: any;
  let errStub: any;

  let config: any;

  let reqMock = {
    protocol: 'http',
    hostname: 'localhost',
    headers: 'some headers'
  };
  let resMock: any = {
    redirect: sinon.mock(),
    locals: {
      host: '',
      url: ''
    }
  };
  let nextMock = sinon.mock();

  let expressInstanceMock: any;
  function expressStub() {
    return expressInstanceMock;
  }

  function stubOutput() {
    logStub = sinon.stub(console, 'log', () => { });
    errStub = sinon.stub(console, 'error', () => { });
  };

  function restoreOutput() {
    logStub.restore();
    errStub.restore();
  };

  beforeEach(() => {
    config = {
      app: {
        title: 'BurgerStack',
        description: 'some description',
        keywords: 'some keywords'
      },
      assets: {
        client: {
          path: 'client'
        }
      },
      files: {
        server: {
          configs: [],
          policies: [],
          routes: []
        }
      },
      logo: 'logo.png',
      favicon: 'favicon.ico',
      csrf: {
        csrf: false,
        // csp: { policy: { 'default-src': '*' } },
        xframe: 'SAMEORIGIN',
        p3p: 'ABCDEF',
        xssProtection: true
      },
      sessionSecret: 'BurgerStack',
      sessionCookie: {
        // session expiration is set by default to 24 hours
        maxAge: 24 * (60 * 60 * 1000),
        // httpOnly flag makes sure the cookie is only accessed
        // through the HTTP protocol and not JS/browser
        httpOnly: true,
        // secure cookie should be turned to true to provide additional
        // layer of security so that the cookie is set only when working
        // in HTTPS mode.
        secure: true
      },
      secure: {
        ssl: true
      }
    };
    expressInstanceMock = {};
    stubs.push(sinon.stub(Config, 'config').returns(config));
  });

  afterEach(() => {
    stubs.forEach((stub) => {
      stub.restore();
    });
    stubs = [];
  });

  describe('Singleton staffs', () => {
    it('.getInstance(), should return an ExpressServer instance.', () => {
      expect(ExpressServer.getInstance()).instanceOf(ExpressServer);
    });

    it('new ExpressServer instance should get an error', () => {
      expect(() => { new ExpressServer(); }).throws('Error: Instantiation failed: Use ExpressServer.getInstance() instead of new.');
    });
  });

  describe('test private methods:', () => {
    let expressServer = (<any>ExpressServer.getInstance());
    describe('private #configureSocketIo', () => {
      it('should config socket and return a server', () => {
        let appMock = expressStub();
        let mockServer = {};
        stubs.push(sinon.stub(SocketIO, 'startServer').returns(mockServer));
        expect(expressServer.configureSocketIO(appMock)).to.equal(mockServer);
      });
    });

    describe('private #initErrorRoutes', () => {
      it('should invoke next if no errer occured', () => {
        expressInstanceMock = {
          use: (cb: Function) => { cb(null, null, null, nextMock); }
        };
        let appMock = expressStub();
        nextMock.once();
        expressServer.initErrorRoutes(appMock);
        nextMock.verify();
      });

      it('should invoke next if no errer occured', () => {
        let errMock = new Error('fake error msg');
        expressInstanceMock = {
          use: (cb: Function) => { cb(errMock, null, resMock, nextMock); }
        };
        let appMock = expressStub();
        nextMock.never();
        resMock.redirect.once();
        stubOutput();
        expressServer.initErrorRoutes(appMock);
        restoreOutput();
        nextMock.verify();
        resMock.redirect.verify();
      });
    });

    describe('private #initModuleServerRoutes', () => {
      it('should require routes if have', () => {
        let appMock = expressStub();
        config.files.server.routes = ['path.to.route'];
        let routesMock = sinon.mock();
        mockRequire(resolve('path.to.route'), routesMock);
        routesMock.withArgs(appMock).once();
        expressServer.initModulesServerRoutes(appMock);
        routesMock.verify();
      });
    });

    describe('private #initModulesServerPolicies', () => {
      it('should require policies and call its invokeRolesPolicies', () => {
        let appMock = expressStub();
        config.files.server.policies = ['path.to.policy'];
        let policy = {
          invokeRolesPolicies: sinon.mock()
        };
        mockRequire(resolve('path.to.policy'), policy);
        policy.invokeRolesPolicies.once();
        expressServer.initModulesServerPolicies(appMock);
        policy.invokeRolesPolicies.verify();
      });
    });

    describe('private #init3rdModulesStatics', () => {
      it('should config libs path and node_modules', () => {
        expressInstanceMock = {
          use: sinon.mock()
        };
        let appMock = expressStub();
        expressInstanceMock.use.twice();
        expressServer.init3rdModulesStatics(appMock);
        expressInstanceMock.use.verify();
      });
    });

    describe('private #initModulesClientRoutes', () => {
      it('should config static root path and client path', () => {
        expressInstanceMock = {
          use: sinon.mock()
        };
        let appMock = expressStub();
        expressInstanceMock.use.twice();
        expressServer.initModulesClientRoutes(appMock);
        expressInstanceMock.use.verify();
      });
    });

    describe('private #initHelmetHeaders', () => {
      it('should init helmet headers and disable "x-powered-by"', () => {
        expressInstanceMock = {
          use: sinon.mock(),
          disable: sinon.mock()
        };
        let appMock = expressStub();
        expressInstanceMock.use.exactly(5);
        expressInstanceMock.disable.withArgs('x-powered-by').once();
        expressServer.initHelmetHeaders(appMock);
        expressInstanceMock.use.verify();
        expressInstanceMock.disable.verify();
      });
    });

    describe('private #initModulesConfiguration', () => {
      it('should init configs with expressApp if have config files', () => {
        config.files.server.configs = ['path.to.config'];
        let appMock = expressStub();
        let configMock = sinon.mock();
        mockRequire(resolve('path.to.config'), configMock);
        configMock.withArgs(appMock).once();
        expressServer.initModulesConfiguration(appMock);
        configMock.verify();
      });
    });

    describe('private #initSession', () => {
      it('should init express session and lusca CSRF middle ware', () => {
        expressInstanceMock = {
          use: sinon.mock()
        };
        stubs.push(sinon.stub(Databases, 'getSessionStore').returns({ on: sinon.spy() }));
        let appMock = expressStub();
        expressInstanceMock.use.twice();
        expressServer.initSession(appMock);
        expressInstanceMock.use.verify();
      });
    });

    describe('private #initViewEngine', () => {
      it('should init hbs view engine with extname ".hbs.html"', () => {
        expressInstanceMock = {
          engine: sinon.mock(),
          set: sinon.mock()
        };
        let appMock = expressStub();
        expressInstanceMock.engine.withArgs('.hbs.html').once();
        expressInstanceMock.set.twice();
        expressServer.initViewEngine(appMock);
        expressInstanceMock.engine.verify();
        expressInstanceMock.set.verify();
      });
    });

    describe('private #initMiddleware', () => {
      it('should init morgan if has configured', () => {
        config = _.merge(config, { log: { format: 'dev' } });
        expressInstanceMock = {
          locals: {
            favicon: 'favicon.ico',
            cache: ''
          },
          set: sinon.spy(),
          use: sinon.spy(),
          enable: sinon.spy()
        };
        stubs.push(sinon.stub(fs, 'statSync').returns({ isDirectory: () => { return false; } }));
        stubs.push(sinon.stub(ThirdPartyModules, 'compression').returns((options: any) => {
          if (_.has(options, 'filter')) {
            options.filter(null, { getHeader: (section: string) => { } });
          }
        }));
        let appMock = expressStub();
        expressServer.initMiddleware(appMock);
      });

      it('should set view cache as false if NODE_ENV is development', () => {
        config = _.merge(config, { log: { format: 'dev' } });
        expressInstanceMock = {
          locals: {
            favicon: 'favicon.ico',
            cache: ''
          },
          set: sinon.spy(),
          use: sinon.spy(),
          enable: sinon.spy()
        };
        stubs.push(sinon.stub(fs, 'statSync').returns({ isDirectory: () => { return false; } }));
        stubs.push(sinon.stub(ThirdPartyModules, 'compression').returns((options: any) => {
          if (_.has(options, 'filter')) {
            options.filter(null, { getHeader: (section: string) => { } });
          }
        }));
        let appMock = expressStub();
        let nodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';
        expressServer.initMiddleware(appMock);
        process.env.NODE_ENV = nodeEnv;
      });

      it('should set locals.cache as memory if NODE_ENV is production', () => {
        config = _.merge(config, { log: { format: 'dev' } });
        expressInstanceMock = {
          locals: {
            favicon: 'favicon.ico',
            cache: ''
          },
          set: sinon.spy(),
          use: sinon.spy(),
          enable: sinon.spy()
        };
        stubs.push(sinon.stub(fs, 'statSync').returns({ isDirectory: () => { return false; } }));
        stubs.push(sinon.stub(ThirdPartyModules, 'compression').returns((options: any) => {
          if (_.has(options, 'filter')) {
            options.filter(null, { getHeader: (section: string) => { } });
          }
        }));
        let appMock = expressStub();
        let nodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';
        expressServer.initMiddleware(appMock);
        process.env.NODE_ENV = nodeEnv;
      });
    });

    describe('private #initLocalVariables', () => {
      it('should init local variable and set protocal', () => {
        config.secure.ssl = false;
        expressInstanceMock = {
          locals: {
            title: '',
            description: '',
            keywords: '',
            logo: '',
            favicon: '',
            secure: false
          },
          use: (cb: Function) => { cb(reqMock, resMock, nextMock); }
        };
        let appMock = expressStub();
        // nextMock.once();
        expressServer.initLocalVariables(appMock);
        nextMock.verify();
      });
    });
  });

  describe('.init', () => {
    it('should init and return an express server', () => {
      stubs.push(sinon.stub(Databases, 'getSessionStore').returns({ on: sinon.spy() }));
      stubs.push(sinon.stub(fs, 'statSync').returns({ isDirectory: () => { return false; } }));
      let mockServer = {};
      stubs.push(sinon.stub(SocketIO, 'startServer').returns(mockServer));
      let server = ExpressServer.init();
      expect(server).to.equal(mockServer);
    });
  });
});

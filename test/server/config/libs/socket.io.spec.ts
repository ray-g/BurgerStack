import { expect } from 'chai';
let sinon = require('sinon');
require('sinon-as-promised');
let mockRequire = require('mock-require');

import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import * as https from 'https';
import * as socketio from 'socket.io';
import { Databases } from '../../../../config/libs/databases';
import { ThirdPartyModules } from '../../../../config/libs/3rd_party_modules';
import { Config } from '../../../../config/config';

import { SocketIO } from '../../../../config/libs/socket.io';

describe('SockerIO class', () => {
  let stubs: any[] = [];

  afterEach(() => {
    stubs.forEach((stub) => {
      stub.restore();
    });
    stubs = [];
  });

  describe('Singleton staffs', () => {
    it('.getInstance(), should return an SocketIO instance.', () => {
      expect(SocketIO.getInstance()).instanceOf(SocketIO);
    });

    it('new Config instance should get an error', () => {
      expect(() => { new SocketIO(); }).throws('Error: Instantiation failed: Use SocketIO.getInstance() instead of new.');
    });
  });

  describe('.startServer', () => {
    let mockApp: any;
    let mockServer: any;
    let socketMock: any;
    let mockIO: any;
    let config: any;
    let httpStub: any;
    let httpsStub: any;

    let sessionStoreErr: any;
    let sessionStoreSession: any;
    let sessionStoreMock = {
      get: (sessionId: any, cb: any) => { cb(sessionStoreErr, sessionStoreSession); }
    };

    function nextFoo(err: any, verified: boolean) { };
    let nextSpy = sinon.spy(nextFoo);

    function requestHandlerMock(request: any, response: any, errCB: any) { errCB(); };

    function cookieParserMock(secret: string) {
      return requestHandlerMock;
    }

    beforeEach(() => {
      socketMock = {
        request: {
        }
      };

      mockIO = {
        use: (cb: Function) => { cb(socketMock, nextSpy); },
        on: (event: string, cb: Function) => { cb(); }
      };

      config = {
        sessionSecret: 'BurgerStack',
        sessionKey: 'sessionId',
        secure: {
          ssl: false,
          certificate: 'cert',
          privateKey: 'key'
        },
        files: {
          server: {
            sockets: []
          }
        }
      };

      httpStub = sinon.stub(http, 'createServer').returns(mockServer);
      httpsStub = sinon.stub(https, 'createServer').returns(mockServer);
      stubs.push(httpStub);
      stubs.push(httpsStub);
      stubs.push(sinon.stub(ThirdPartyModules, 'cookieParser').returns(cookieParserMock));
      stubs.push(sinon.stub(fs, 'readFileSync').returns(true));
      stubs.push(sinon.stub(Config, 'config').returns(config));
      stubs.push(sinon.stub(socketio, 'listen').returns(mockIO));

      sessionStoreErr = undefined;
      sessionStoreSession = 'fakeSession';
      stubs.push(sinon.stub(Databases, 'getSessionStore').returns(sessionStoreMock));
    });

    it('should use http server if not use secure config', () => {
      mockIO.use = (cb: Function) => { };

      SocketIO.startServer(mockApp);

      expect(httpStub.called).to.be.true;
    });

    it('should use https server if use secure config', () => {
      config.secure.ssl = true;
      mockIO.use = (cb: Function) => { };
      SocketIO.startServer(mockApp);

      expect(httpsStub.calledOnce).to.be.true;
    });

    it('should return next with error when sessionId not found', () => {
      SocketIO.startServer(mockApp);

      expect(nextSpy.withArgs(new Error('sessionId was not found in socket.request'), false).called).to.be.true;
    });

    it('should load socket configurations if exist', () => {
      config.files.server.sockets = ['fake_socket'];
      let socketConfSpy = sinon.spy();
      mockRequire(path.resolve('fake_socket'), socketConfSpy);
      SocketIO.startServer(mockApp);
      expect(socketConfSpy.called).to.be.true;
    });

    describe('when sessionID found', () => {
      beforeEach(() => {
        socketMock = {
          request: {
            signedCookies: {},
            user: 'fakeUser'
          }
        };
        socketMock.request.signedCookies['sessionId'] = 'zzz';


      });

      it('should return next with error if sth wrong with sessionStore', () => {
        sessionStoreErr = new Error('fake error');
        SocketIO.startServer(mockApp);
        expect(nextSpy.withArgs(new Error('fake error'), false).called).to.be.true;
      });

      it('should return next with error if session not found sessionStore', () => {
        sessionStoreSession = false;
        SocketIO.startServer(mockApp);
        expect(nextSpy.withArgs(new Error('session was not found for sessionId'), false).called).to.be.true;
      });

      it('should return next with error if failed to get user by passport', () => {
        socketMock.request.user = '';
        SocketIO.startServer(mockApp);
        // Temp disabled auth
        // expect(nextSpy.withArgs(new Error('User is not authenticated'), false).called).to.be.true;
      });

      it('should return next without error if everything OK', () => {
        SocketIO.startServer(mockApp);
        expect(nextSpy.withArgs(null, true).called).to.be.true;
      });
    });
  });
});

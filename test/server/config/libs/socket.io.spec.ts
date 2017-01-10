import { expect } from 'chai';
let sinon = require('sinon');
require('sinon-as-promised');
let mockRequire = require('mock-require');

function requestHandlerMock(request: any, response: any, errCB: any) { errCB(); };

function cookieParserMock(secret: string) {
  return requestHandlerMock;
}

mockRequire('cookie-parser', cookieParserMock);
mockRequire.reRequire('cookie-parser');

import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import * as https from 'https';
import * as socketio from 'socket.io';
import { Databases } from '../../../../config/libs/databases';
import { Config } from '../../../../config/config';

import * as target from '../../../../config/libs/socket.io';
let SocketIO = target.SocketIO;

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
    let socketMock: any = {
      request: {}
    };
    let mockIO: any;
    let config: any;
    let httpStub: any;
    let httpsStub: any;

    function nextFoo(err: any, verified: boolean) { };

    beforeEach(() => {
      mockIO = {
        use: (cb: Function) => { cb(socketMock, nextFoo); },
        on: (event: string, cb: Function) => { cb(); }
      };

      config = {
        sessionSecret: 'BurgerStack',
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
      stubs.push(sinon.stub(fs, 'readFileSync').returns(true));
      stubs.push(sinon.stub(Config, 'config').returns(config));
      stubs.push(sinon.stub(socketio, 'listen').returns(mockIO));
      stubs.push(sinon.stub(Databases, 'getSessionStore'));
    });

    afterEach(() => {
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
      // SocketIO.startServer(mockApp);
    });

    it('should load socket configurations if exist', () => {
      config.files.server.sockets = ['fake_socket'];
      let socketConfSpy = sinon.spy();
      mockRequire(path.resolve('fake_socket'), socketConfSpy);
      // SocketIO.startServer(mockApp);
      // expect(socketConfSpy.called).to.be.true;
    });
  });
});

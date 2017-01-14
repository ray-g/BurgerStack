// import { expect } from 'chai';
let sinon = require('sinon');

import { Request, Response } from 'express';
import { CoreServerController } from '../../../../server/core/controllers/core.server.controller';

describe('CoreServerController', () => {
  describe('.renderIndex', () => {
    it('should render index page', () => {
      let resMock = {
        render: sinon.mock()
      };
      resMock.render.withArgs('index').once();
      CoreServerController.renderIndex(null, <Response>resMock);
      resMock.render.verify();
    });
  });

  describe('.renderServerError', () => {
    it('should render 500 page', () => {
      let resMock = {
        render: sinon.mock(),
        status: sinon.mock()
      };

      resMock.status.withArgs(500).once().returns(resMock);
      resMock.render.withArgs('500').once();
      CoreServerController.renderServerError(null, <Response>resMock);
      resMock.render.verify();
      resMock.status.verify();
    });
  });

  describe('.renderNotFound', () => {
    let reqMock: any;
    let resMock: any;
    let formats: any;

    beforeEach(() => {
      reqMock = { originalUrl: 'some_url' };
      resMock = {
        render: sinon.mock(),
        json: sinon.mock(),
        send: sinon.mock(),
        status: sinon.mock(),
        format: (param: any) => { formats = param; }
      };
    });

    it('should render 404', () => {

      resMock.status.withArgs(404).once().returns(resMock);
      resMock.render.withArgs('404').once();
      CoreServerController.renderNotFound(<Request>reqMock, <Response>resMock);
      formats['text/html']();
      resMock.render.verify();
      resMock.status.verify();
    });

    it('should send json with error msg', () => {
      resMock.status.withArgs(404).once().returns(resMock);
      resMock.json.withArgs({ error: 'Path not found' }).once();
      CoreServerController.renderNotFound(<Request>reqMock, <Response>resMock);
      formats['application/json']();
      resMock.json.verify();
      resMock.status.verify();
    });

    it('should send error msg', () => {
      resMock.status.withArgs(404).once().returns(resMock);
      resMock.send.withArgs('Path not found').once();
      CoreServerController.renderNotFound(<Request>reqMock, <Response>resMock);
      formats['default']();
      resMock.send.verify();
      resMock.status.verify();
    });
  });
});

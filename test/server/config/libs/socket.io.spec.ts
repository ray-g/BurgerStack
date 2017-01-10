import { expect } from 'chai';
// let sinon = require('sinon');

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

  });
});

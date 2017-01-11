import { expect } from 'chai';
// let sinon = require('sinon');
// require('sinon-as-promised');

import { ExpressServer } from '../../../../config/libs/express';

describe('ExpressServer class', () => {
  let stubs: any[] = [];

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
});

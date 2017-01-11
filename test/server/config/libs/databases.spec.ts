import { expect } from 'chai';
// let sinon = require('sinon');
// require('sinon-as-promised');

import { Databases } from '../../../../config/libs/databases';

describe('Databases class', () => {
  let stubs: any[] = [];

  afterEach(() => {
     stubs.forEach((stub) => {
       stub.restore();
     });
    stubs = [];
  });

   describe('Singleton staffs', () => {
    it('.getInstance(), should return an Databases instance.', () => {
      expect(Databases.getInstance()).instanceOf(Databases);
    });

    it('new Databases instance should get an error', () => {
      expect(() => { new Databases(); }).throws('Error: Instantiation failed: Use Databases.getInstance() instead of new.');
    });
  });
});

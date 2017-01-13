import { expect } from 'chai';
// let sinon = require('sinon');
// require('sinon-as-promised');

import { Mongoose } from '../../../../config/libs/mongoose';

describe('Mongoose class', () => {
  let stubs: any[] = [];

  afterEach(() => {
    stubs.forEach((stub) => {
      stub.restore();
    });
    stubs = [];
  });

  describe('Singleton staffs', () => {
    it('.getInstance(), should return an Mongoose instance.', () => {
      expect(Mongoose.getInstance()).instanceOf(Mongoose);
    });

    it('new Mongoose instance should get an error', () => {
      expect(() => { new Mongoose(); }).throws('Error: Instantiation failed: Use Mongoose.getInstance() instead of new.');
    });
  });
});

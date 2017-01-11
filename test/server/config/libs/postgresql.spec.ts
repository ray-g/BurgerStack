import { expect } from 'chai';
// let sinon = require('sinon');
// require('sinon-as-promised');

import { PostgreSql } from '../../../../config/libs/postgresql';

describe('PostgreSql  class', () => {
  let stubs: any[] = [];

  afterEach(() => {
     stubs.forEach((stub) => {
       stub.restore();
     });
    stubs = [];
  });

   describe('Singleton staffs', () => {
    it('.getInstance(), should return an PostgreSql instance.', () => {
      expect(PostgreSql.getInstance()).instanceOf(PostgreSql );
    });

    it('new PostgreSql  instance should get an error', () => {
      expect(() => { new PostgreSql(); }).throws('Error: Instantiation failed: Use PostgreSql.getInstance() instead of new.');
    });
  });
});

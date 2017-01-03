import * as _ from 'lodash';
import chai = require('chai');
import * as utilsCommon from '../../../../tools/utils/common';

let expect = chai.expect;

describe('tools/utils/common', () => {

  describe('isStringArray(param)', () => {
    it('should return true when param is string[]', (done) => {
      expect(utilsCommon.isStringArray(['a'])).to.equal(true);
      expect(utilsCommon.isStringArray(['a', 'b'])).to.equal(true);
      expect(utilsCommon.isStringArray(['a', ''])).to.equal(true);
      done();
    });

    it('should return false when param is not string[]', (done) => {
      expect(utilsCommon.isStringArray('a')).to.equal(false);
      expect(utilsCommon.isStringArray(1)).to.equal(false);
      expect(utilsCommon.isStringArray([1, 2])).to.equal(false);
      expect(utilsCommon.isStringArray({})).to.equal(false);
      expect(utilsCommon.isStringArray({'a': 'b'})).to.equal(false);
      expect(utilsCommon.isStringArray([])).to.equal(false);
      expect(utilsCommon.isStringArray(['a', 1])).to.equal(false);
      expect(utilsCommon.isStringArray(['a', {}])).to.equal(false);
      expect(utilsCommon.isStringArray(['a', ['b']])).to.equal(false);
      expect(utilsCommon.isStringArray(['a', {}])).to.equal(false);
      done();
    });
  });
});

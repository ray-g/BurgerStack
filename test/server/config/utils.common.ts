import * as _ from 'lodash';
import chai = require('chai');
import { assetsUnion } from '../../../config/utils/common';

let expect = chai.expect;

function isStringArray(value: any) {
  if (value instanceof Array) {
    let somethingIsNotString = false;
    value.forEach((item) => {
      if (typeof item !== 'string') {
        somethingIsNotString = true;
        return;
      }
    });
    return !somethingIsNotString;
  }
  return false;
}

describe('config.utils.common:', () => {

  describe('assetsUnion', () => {
    it('return type should be string[]', (done) => {
      let arr1 = ['aaa', 'bbb'];
      let arr2 = ['ccc', 'ddd'];
      let assets = assetsUnion(arr1, arr2);
      expect(isStringArray(assets)).to.equals(true);
      done();
    });

    it('should return correct array', (done) => {
      let arr1 = ['aaa', 'bbb'];
      let arr2 = ['ccc', 'ddd'];
      let assets = assetsUnion(arr1, arr2);
      expect(_.isEqual(assets, ['aaa', 'bbb', 'ccc', 'ddd'])).to.equals(true);
      done();
    });

    it('should return combined array', (done) => {
      let arr1 = ['aaa', 'bbb'];
      let arr2 = ['bbb', 'ddd'];
      let assets = assetsUnion(arr1, arr2);
      expect(_.isEqual(assets, ['aaa', 'bbb', 'ddd'])).to.equals(true);
      done();
    });
  });
});

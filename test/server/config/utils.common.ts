import * as _ from 'lodash';
import chai = require('chai');
import sinon = require('sinon');
import * as utilsCommon from '../../../config/utils/common';
import * as glob from 'glob';

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

describe('config/utils/common:', () => {

  describe('assetsUnion()', () => {
    it('should return a string[]', (done) => {
      let arr1 = ['aaa', 'bbb'];
      let arr2 = ['ccc', 'ddd'];
      let assets = utilsCommon.assetsUnion(arr1, arr2);
      expect(isStringArray(assets)).to.equals(true);
      done();
    });

    it('should return correct array', (done) => {
      let arr1 = ['aaa', 'bbb'];
      let arr2 = ['ccc', 'ddd'];
      let assets = utilsCommon.assetsUnion(arr1, arr2);
      expect(_.isEqual(assets, ['aaa', 'bbb', 'ccc', 'ddd'])).to.equals(true);
      done();
    });

    it('should return combined array', (done) => {
      let arr1 = ['aaa', 'bbb'];
      let arr2 = ['bbb', 'ddd'];
      let assets = utilsCommon.assetsUnion(arr1, arr2);
      expect(_.isEqual(assets, ['aaa', 'bbb', 'ddd'])).to.equals(true);
      done();
    });
  });

  describe('getGlobbedPaths()', () => {
    beforeEach(() => {
      sinon.stub(glob, 'sync')
      .onFirstCall().returns(['aaa', 'bbb', 'ccc', 'exclude1'])
      .onSecondCall().returns(['xxx', 'yyy', 'zzz', 'exclude2']);
    });

    afterEach(() => {
      (<any>glob.sync).restore();
    });

    it('should return a string[]', (done) => {
      let paths = utilsCommon.getGlobbedPaths('a', '');
      expect(isStringArray(paths)).to.equals(true);
      done();
    });

    it('should return 4 items', (done) => {
      let paths = utilsCommon.getGlobbedPaths('a', '');
      expect(paths.length).to.equal(4);
      done();
    });

    it('should return 4 items withiout "exclude1" when exclude provide', (done) => {
      let paths = utilsCommon.getGlobbedPaths('a', 'exclude1');
      let hasExclude = false;
      paths.forEach((path) => {
        if (path.includes('exclude')) {
          hasExclude = true;
        }
      });
      expect(paths.length).to.equal(4);
      expect(hasExclude).to.equal(false);
      done();
    });

    it('should return 7 items when exclude provide and 2 patterns provide', (done) => {
      let paths = utilsCommon.getGlobbedPaths(['a', 'b'], ['exclude1', 'exclude2']);
      let hasExclude = false;
      paths.forEach((path) => {
        if (path.includes('exclude')) {
          hasExclude = true;
        }
      });
      expect(paths.length).to.equal(7);
      expect(hasExclude).to.equal(false);
      done();
    });

    it('should return url itself', (done) => {
      let fakeUrl = 'http://fake/url';
      let paths = utilsCommon.getGlobbedPaths(['a', 'b', fakeUrl], ['exclude1', 'exclude2']);
      let hasUrl = false;
      paths.forEach((path) => {
        if (path === fakeUrl) {
          hasUrl = true;
        }
      });
      expect(paths.length).to.equal(8);
      expect(hasUrl).to.equal(true);
      done();
    });
  });
});

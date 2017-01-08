import { expect } from 'chai';
import { resolve } from 'path';
import { getGlobbedPaths } from '../../../config/utils';

describe('Assets.env.loader', () => {
  it('try to load all assets and env config files for coverage', () => {
    let assets = [
      'dist/config/assets/*.js',
      'dist/config/env/*.js'
    ];
    let files = getGlobbedPaths(assets, '');
    files.forEach((file) => {
      expect(typeof require(resolve(file))).to.equal('object');
    });
  });
});

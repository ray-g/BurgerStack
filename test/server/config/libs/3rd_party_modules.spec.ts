import { expect } from 'chai';

import { ThirdPartyModules } from '../../../../config/libs/3rd_party_modules';

describe('ThirdPartyModules', () => {
  let Modules = ThirdPartyModules;
  it('.cookieParser should return module "cookie-parser"', () => {
    expect(Modules.cookieParser()).to.equal(require('cookie-parser'));
  });
});

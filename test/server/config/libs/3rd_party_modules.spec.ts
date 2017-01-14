import { expect } from 'chai';

import { ThirdPartyModules } from '../../../../config/libs/3rd_party_modules';

describe('ThirdPartyModules', () => {
  let Modules = ThirdPartyModules;
  it('.cookieParser should return module "cookie-parser"', () => {
    expect(Modules.cookieParser()).to.equal(require('cookie-parser'));
  });

  it('.Sequelize should return module "sequelize"', () => {
    expect(Modules.Sequelize()).to.equal(require('sequelize'));
  });

  it('mongoose should return module "mongoose"', () => {
    expect(Modules.mongoose()).to.equal(require('mongoose'));
  });

  it('compression should return module "compression"', () => {
    expect(Modules.compression()).to.equal(require('compression'));
  });
});

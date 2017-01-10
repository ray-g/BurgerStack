import { expect } from 'chai';
import { resolve } from 'path';
import sinon = require('sinon');

import { AppServer } from '../../config/libs/server';

describe('Server entry file', () => {
  it('should call server start', () => {
    let startStub = sinon.stub(AppServer, 'start');
    let chdirStub = sinon.stub(process, 'chdir', () => { });
    require(resolve('dist/server.js'));
    expect(chdirStub.calledWith(resolve('dist'))).to.be.true;
    expect(startStub.called).to.be.true;
    chdirStub.restore();
    startStub.restore();
  });
});

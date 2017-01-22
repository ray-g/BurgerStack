import { expect } from 'chai';
import sinon = require('sinon');
import * as karmaStart from '../../../tools/utils/karma.start';

import * as karma from 'karma';

describe('tools/utils/karma.start', () => {

  describe('startKarma()', () => {
    it('karma.Server().start() should be called', () => {
      let mockServer = {
        start: sinon.spy()
      };
      let doneSpy = sinon.spy();
      sinon.stub(karma, 'Server').returns(mockServer);

      karmaStart.startKarma(doneSpy, {});
      expect(mockServer.start.called).to.be.true;
    });
  });
});

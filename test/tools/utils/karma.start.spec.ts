import { expect } from 'chai';
import sinon = require('sinon');
import * as karmaStart from '../../../tools/utils/karma.start';

import * as karma from 'karma';

describe('tools/utils/karma.start', () => {

  describe('startKarma()', () => {
    it('karma.Server().start() should be called', () => {
      let mockServer = {
        start: function (done: any) { done(); }
      };
      let doneSpy = sinon.spy();
      sinon.stub(karma, 'Server').returns(mockServer);

      karmaStart.startKarma(doneSpy, {});
      expect(doneSpy.called).to.be.true;
    });
  });
});

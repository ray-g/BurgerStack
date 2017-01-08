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
      let emptyDone = function () { };
      let doneSpy = sinon.spy(emptyDone);
      sinon.stub(karma, 'Server').returns(mockServer);

      karmaStart.startKarma(emptyDone, {});
      expect(doneSpy.calledOnce);
    });
  });
});

import { expect } from 'chai';

import { ErrorHandler } from '../../../../server/core/controllers/errors.server.controller';

describe('ErrorHandler', () => {
  let err: any;

  beforeEach(() => {
    err = {
      code: undefined,
      errmsg: undefined,
      errors: undefined,
    };
  });
  describe('.getErrorMessage', () => {
    it('should return sth wrong if err has code other than 11000 and 11001', () => {
      err = {
        code: 10000
      };
      expect(ErrorHandler.getErrorMessage(err)).to.equal('Something went wrong');
    });

    it('should return unique message when mongodb <= 3.0', () => {
      err = {
        code: 11000,
        errmsg: 'E11000 duplicate key error index: burgerstack-dev.users.$email_1 dup key: { : \'test@user.com\' }'
      };
      expect(ErrorHandler.getErrorMessage(err)).to.equal('Email already exists');
    });

    it('should return unique message when mongodb >= 3.2', () => {
      err = {
        code: 11001,
        errmsg: 'E11001 duplicate key error collection: burgerstack-dev.users index: email_1 dup key: { : \'test@user.com\' }'
      };
      expect(ErrorHandler.getErrorMessage(err)).to.equal('Email already exists');
    });

    it('should return unique field already exists if sth wrong during parse errmsg', () => {
      err = {
        code: 11000,
        errmsg: null
      };
      expect(ErrorHandler.getErrorMessage(err)).to.equal('Unique field already exists');
    });

    it('should return first available message in errors', () => {
      err = {
        errors: {
          name1: {
            message: null
          },
          name2: {
            message: 'error message'
          }
        }
      };
      expect(ErrorHandler.getErrorMessage(err)).to.equal('error message');
    });
  });
});

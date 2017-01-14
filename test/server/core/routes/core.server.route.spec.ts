import { expect } from 'chai';

import { CoreServerController } from '../../../../server/core/controllers/core.server.controller';
let route = require('../../../../server/core/routes/core.server.route');

describe('core.server.route', () => {
  let routeTable: any = {};
  let appMock = {
    route: (path: string) => {
      return {
        get: (action: Function) => {
          routeTable[path] = action;
        }
      };
    }
  };

  it('should config routes', () => {
    route(appMock);
    expect(routeTable['/server-error']).to.equal(CoreServerController.renderServerError);
    expect(routeTable['/:url(api|modules|lib)/*']).to.equal(CoreServerController.renderNotFound);
    expect(routeTable['/*']).to.equal(CoreServerController.renderIndex);
  });
});

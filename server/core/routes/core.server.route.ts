import { CoreServerController } from '../controllers/core.server.controller';

module.exports = function(app: any) {
  // Root routing
  // Define error pages
  app.route('/server-error').get(CoreServerController.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(CoreServerController.renderNotFound);

  // Define application route
  app.route('/*').get(CoreServerController.renderIndex);

  // For debug 404
  // app.route('/index.html').get(core.renderIndex);
};

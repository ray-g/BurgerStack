import { Request, Response } from 'express';

export class CoreServerController {
  /**
 * Render the main application page
 */
  public static renderIndex(req: Request, res: Response) {
    res.render('public/index');
  }

  /**
   * Render the server error page
   */
  public static renderServerError(req: Request, res: Response) {
    res.status(500).render('public/500', {
      error: 'Oops! Something went wrong...'
    });
  }

  /**
   * Render the server not found responses
   * Performs content-negotiation on the Accept HTTP header
   */
  public static renderNotFound(req: Request, res: Response) {
    res.status(404).format({
      'text/html': function () {
        res.render('public/404', {
          url: req.originalUrl
        });
      },
      'application/json': function () {
        res.json({
          error: 'Path not found'
        });
      },
      'default': function () {
        res.send('Path not found');
      }
    });
  }
}

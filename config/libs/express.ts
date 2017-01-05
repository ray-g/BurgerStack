import * as path from 'path';
import * as _ from 'lodash';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as compress from 'compression';
import * as methodOverride from 'method-override';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import favicon = require('serve-favicon');
import flash = require('connect-flash');
import { Express, Request, Response } from 'express';
import { Config } from '../config';
import { Logger } from './logger';
import { SocketIO } from './socket.io';
import { Databases } from './databases';
let express = require('express');
let session = require('express-session');
let hbs = require('express-hbs');
let lusca = require('lusca');
let config = Config.config();

export class ExpressServer {
  private static _instance: ExpressServer = new ExpressServer();

  public static getInstance(): ExpressServer {
    return ExpressServer._instance;
  }

  public static init(): Express {
    return ExpressServer._instance.init();
  }

  constructor() {
    if (ExpressServer._instance) {
      throw new Error('Error: Instantiation failed: Use Express.getInstance() instead of new.');
    }
    ExpressServer._instance = this;
  }

  /**
   * Initialize the Express application
   */
  private init(): Express {
    // Initialize express app
    let app = express();

    // Initialize local variables
    this.initLocalVariables(app);

    // Initialize Express middleware
    this.initMiddleware(app);

    // Initialize Express view engine
    this.initViewEngine(app);

    // Initialize Helmet security headers
    this.initHelmetHeaders(app);

    // Initialize modules static client routes, before session!
    this.initModulesClientRoutes(app);

    // Initialize 3rd modules
    this.init3rdModulesStatics(app);

    // Initialize Express session
    this.initSession(app);

    // Initialize Modules configuration
    this.initModulesConfiguration(app);

    // Initialize modules server authorization policies
    this.initModulesServerPolicies(app);

    // Initialize modules server routes
    this.initModulesServerRoutes(app);

    // Initialize error routes
    this.initErrorRoutes(app);

    // Configure Socket.io
    app = this.configureSocketIO(app);

    return app;
  };

  /**
   * Initialize local variables
   */
  private initLocalVariables(app: Express) {
    // Setting application local variables
    app.locals.title = config.app.title;
    app.locals.description = config.app.description;
    if (config.secure && config.secure.ssl === true) {
      app.locals.secure = config.secure.ssl;
    }
    app.locals.keywords = config.app.keywords;
    app.locals.logo = config.logo;
    app.locals.favicon = config.favicon;

    // Passing the request url to environment locals
    app.use((req: Request, res, next) => {
      res.locals.host = req.protocol + '://' + req.hostname;
      let headers = <any>req.headers;
      res.locals.url = req.protocol + '://' + <any>(headers).host + req.originalUrl;
      next();
    });
  };

  /**
   * Initialize application middleware
   */
  private initMiddleware(app: Express) {
    // Showing stack errors
    app.set('showStackError', true);

    // Enable jsonp
    app.enable('jsonp callback');

    // Should be placed before express.static
    app.use(compress({
      filter: (req: Request, res: Response) => {
        return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
      },
      level: 9
    }));

    // Initialize favicon middleware
    app.use(favicon(app.locals.favicon));

    // Enable logger (morgan) if enabled in the configuration file
    if (_.has(config, 'log.format')) {
      app.use(morgan(Logger.getLogFormat(), Logger.getMorganOptions()));
    }

    // Environment dependent middleware
    if (process.env.NODE_ENV === 'development') {
      // Disable views cache
      app.set('view cache', false);
    } else if (process.env.NODE_ENV === 'production') {
      app.locals.cache = 'memory';
    }

    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({
      extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // Add the cookie parser and flash middleware
    app.use(cookieParser());
    app.use(flash());
  };

  /**
   * Configure view engine
   */
  private initViewEngine(app: Express) {
    // Set views path and view engine
    app.engine('.html', hbs.express4({
      extname: '.html'
    }));

    // Set views path and view engine
    app.set('view engine', 'html');
    app.set('views', path.resolve('./client'));
  };

  /**
   * Configure Express session
   */
  private initSession(app: Express) {
    // Express MongoDB session storage
    app.use(session({
      saveUninitialized: true,
      resave: true,
      secret: config.sessionSecret,
      cookie: {
        maxAge: config.sessionCookie.maxAge,
        httpOnly: config.sessionCookie.httpOnly,
        secure: config.sessionCookie.secure && config.secure.ssl
      },
      key: config.sessionKey,
      store: Databases.getSessionStore()
    }));

    // Add Lusca CSRF Middleware
    app.use(lusca(config.csrf));
  };

  /**
   * Invoke modules server configuration
   */
  private initModulesConfiguration(app: Express) {
    config.files.server.configs.forEach((configPath: string) => {
      require(path.resolve(configPath))(app);
    });
  };

  /**
   * Configure Helmet headers configuration
   */
  private initHelmetHeaders(app: Express) {
    // Use helmet to secure Express headers
    let SIX_MONTHS = 15778476000;
    app.use(helmet.frameguard());
    app.use(helmet.xssFilter());
    app.use(helmet.noSniff());
    app.use(helmet.ieNoOpen());
    app.use(helmet.hsts({
      maxAge: SIX_MONTHS,
      includeSubdomains: true,
      force: true
    }));
    app.disable('x-powered-by');
  };

  /**
   * Configure the modules static routes
   */
  private initModulesClientRoutes(app: Express) {
    // Setting the app router and static folder
    app.use('/', express.static(path.resolve('./client')));
  };

  /**
   * Configure node_modules and third-parties relative to dist.
   */
  private init3rdModulesStatics(app: Express) {
    app.use('/libs', express.static(path.resolve(__dirname, './client/libs')));
    app.use(express.static(path.resolve(__dirname, '../node_modules')));
  };

  /**
   * Configure the modules ACL policies
   */
  private initModulesServerPolicies(app: Express) {
    // Globbing policy files
    config.files.server.policies.forEach((policyPath: Express) => {
      require(path.resolve(policyPath)).invokeRolesPolicies();
    });
  };

  /**
   * Configure the modules server routes
   */
  private initModulesServerRoutes(app: Express) {
    // Globbing routing files
    config.files.server.routes.forEach((routePath: string) => {
      require(path.resolve(routePath))(app);
    });
  };

  /**
   * Configure error handling
   */
  private initErrorRoutes(app: Express) {
    app.use((err: any, req: Request, res: Response, next: any) => {
      // If the error object doesn't exists
      if (!err) {
        return next();
      }

      // Log it
      console.error(err.stack);

      // Redirect to error page
      res.redirect('/server-error');
    });
  };

  /**
   * Configure Socket.io
   */
  private configureSocketIO(app: Express) {
    // Load the Socket.io configuration
    let server = SocketIO.startServer(app);

    // Return server object
    return server;
  };
}

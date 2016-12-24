import * as path from 'path';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import * as socketio from 'socket.io';
import { Express, Response } from 'express';

import { Databases } from './databases';
import { Config } from '../config';

let config = Config.config();

export class SocketIO {
  private static _instance: SocketIO = new SocketIO();

  public static getInstance(): SocketIO {
    return SocketIO._instance;
  }

  public static startServer(app: Express, db: any) {
    let server;
    if (config.secure && config.secure.ssl === true) {
      // Load SSL key and certificate
      let privateKey = fs.readFileSync(path.resolve(config.secure.privateKey), 'utf8');
      let certificate = fs.readFileSync(path.resolve(config.secure.certificate), 'utf8');
      let options = {
        key: privateKey,
        cert: certificate,
        //  requestCert : true,
        //  rejectUnauthorized : true,
        secureProtocol: 'TLSv1_method',
        ciphers: [
          'ECDHE-RSA-AES128-GCM-SHA256',
          'ECDHE-ECDSA-AES128-GCM-SHA256',
          'ECDHE-RSA-AES256-GCM-SHA384',
          'ECDHE-ECDSA-AES256-GCM-SHA384',
          'DHE-RSA-AES128-GCM-SHA256',
          'ECDHE-RSA-AES128-SHA256',
          'DHE-RSA-AES128-SHA256',
          'ECDHE-RSA-AES256-SHA384',
          'DHE-RSA-AES256-SHA384',
          'ECDHE-RSA-AES256-SHA256',
          'DHE-RSA-AES256-SHA256',
          'HIGH',
          '!aNULL',
          '!eNULL',
          '!EXPORT',
          '!DES',
          '!RC4',
          '!MD5',
          '!PSK',
          '!SRP',
          '!CAMELLIA'
        ].join(':'),
        honorCipherOrder: true
      };

      // Create new HTTPS Server
      server = https.createServer(options, app);
    } else {
      // Create a new HTTP server
      server = http.createServer(app);
    }
    // Create a new Socket.io server
    let io = socketio.listen(server);

    // Create a MongoDB storage object
    let mongoStore = Databases.getSessionStore(db);

    // Intercept Socket.io's handshake request
    io.use((socket, next: any) => {
      // Use the 'cookie-parser' module to parse the request cookies
      cookieParser(config.sessionSecret)(socket.request, <Response>{}, (err: any) => {
        // Get the session id from the request cookies
        let sessionId = socket.request.signedCookies ? socket.request.signedCookies[config.sessionKey] : undefined;

        if (!sessionId) {
          return next(new Error('sessionId was not found in socket.request'), false);
        }

        // Use the mongoStorage instance to get the Express session information
        mongoStore.get(sessionId, (error: any, session: any) => {
          if (error) {
            return next(error, false);
          }

          if (!session) {
            return next(new Error('session was not found for ' + sessionId), false);
          }

          // Set the Socket.io session information
          socket.request.session = session;

          // Use Passport to populate the user details
          passport.initialize()(socket.request, <Response>{}, function () {
            passport.session()(socket.request, <Response>{}, function () {
              if (socket.request.user) {
                next(null, true);
              } else {
                // Temp disable auth.
                // next(new Error('User is not authenticated'), false);
                next(null, true);
              }
            });
          });
        });
      });
    });

    // Add an event listener to the 'connection' event
    io.on('connection', (socket) => {
      config.files.server.sockets.forEach((socketConfiguration: string) => {
        require(path.resolve(socketConfiguration))(io, socket);
      });
    });

    return server;
  }

  constructor() {
    if (SocketIO._instance) {
      throw new Error('Error: Instantiation failed: Use SocketIO.getInstance() instead of new.');
    }
    SocketIO._instance = this;
  }
}

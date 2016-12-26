const BaseEnv = {
  app: {
    title: 'BurgerStack',
    description: 'All cool staffs in one stack.',
    version: '0.0.1'
  },
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'BurgerStack',
  // sessionKey is set to the generic sessionId key used by PHP applications
  // for obsecurity reasons
  sessionKey: 'sessionId',
  // sessionStorage is to specify where to store sessions.
  // There are 3 options: 'mongodb', 'postgresql', 'redis'.
  // 'redis' is the default option.
  sessionStorage: 'redis',
  sessionStoreName: 'BurgerStackSessions',
  // Lusca config
  csrf: {
    csrf: false,
    // csp: { policy: { 'default-src': '*' } },
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    xssProtection: true
  },
  logo: 'client/assets/img/logo.png',
  favicon: 'client/assets/img/favicon.ico',
  uploads: {
    profileUpload: {
      dest: './uploads/profile/', // Profile upload destination path
      limits: {
        fileSize: 1 * 1024 * 1024 // Max file size in bytes (1 MB)
      }
    }
  }
};

export = BaseEnv;

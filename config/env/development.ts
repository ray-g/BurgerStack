import BaseEnv = require('./base');

const DevelopmentEnv = {
  postgres: {
    options: {
      host: process.env.PG_ADDR || 'localhost',
      port: process.env.PG_PORT || 5432,
      username: '',
      password: '',
      database: 'burgerstack_dev',
      // Logging method
      // 'console.log', 'false', default 'false'
      logging: false
    },
    sync: {
      // If force is true, each DAO will do DROP TABLE IF EXISTS ...,
      // before it tries to create its own table
      force: process.env.PG_FORCE === 'true'
    }
  },
  mongodb: {
    uri: 'mongodb://' + (process.env.MONGO_ADDR || 'localhost') + ':' + (process.env.MONGO_PORT || '27017') + '/burgerstack-dev',
    options: {
      user: '',
      pass: ''
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  redis: {
    uri: 'redis://' + (process.env.REDIS_ADDR || 'localhost') + ':' + (process.env.REDIS_PORT || '6379'),
    options: {
      db: 'burgerstack-dev'
    },
    auth: {
      enabled: false,
      pass: ''
    }
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    fileLogger: {
      directoryPath: process.cwd(),
      fileName: 'server.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    },
    // true: Only log to file.
    // false: Log to both file and console.
    fileOnly: true
  },
  app: {
    title: BaseEnv.app.title + ' - Development Environment'
  }
};

export = DevelopmentEnv;

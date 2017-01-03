// Rename this file to local-NODE_ENV.ts (i.e. local-development.ts, or local-test.ts) for having a local configuration variables that
// will not get commited and pushed to remote repositories.
// Use it for your API keys, passwords, etc.

// WARNING: When using this example for multiple NODE_ENV's concurrently, make sure you update the 'db' settings appropriately.
// You do not want to accidentally overwrite/lose any data. For instance, if you create a file for 'test' and don't change the
// database name in the setting below, running the tests will drop all the data from the specified database.
//
// You may end up with a list of files, that will be used with their corresponding NODE_ENV:
//
// local-development.js
// local-test.js
// local-production.js
//

/* For example (Development):*/

const LocalEnv = {
  postgres: {
    options: {
      host: 'localhost',
      username: 'burgerstack',
      password: 'changeme'
    }
  },
  mongodb: {
    uri: 'mongodb://localhost/burgerstack-dev',
    options: {
      user: '',
      pass: ''
    }
  },
  redis: {
    options: {
      db: 'burgerstack-dev'
    }
  },
  sessionSecret: process.env.SESSION_SECRET || 'youshouldchangethistosomethingsecret'
};

export = LocalEnv;


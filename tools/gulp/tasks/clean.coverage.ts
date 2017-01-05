let del = require('del');
const config = require('../config');

export = () => {
  return del(config.tests.coverageDir);
};

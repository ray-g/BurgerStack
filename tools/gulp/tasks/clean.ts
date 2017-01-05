let del = require('del');
const config = require('../config');

export = () => {
  return del(config.dist.all);
};

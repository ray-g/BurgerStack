let del = require('del');
const baseAssets = require('../../../config/assets/base');

export = () => {
  return del(baseAssets.dist.all);
};

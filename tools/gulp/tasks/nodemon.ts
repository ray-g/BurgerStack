import { NodeMon } from '../libs/nodemon';

const baseAssets = require('../../../config/assets/base');

// Nodemon task
export = () => {
  NodeMon.start(
    baseAssets.dist.entry,
    baseAssets.dist.entry,
    'js, html',
    ['--debug']
  );
};

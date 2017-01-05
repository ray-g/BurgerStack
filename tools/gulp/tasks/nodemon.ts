import { NodeMon } from '../libs/nodemon';

const config = require('../config');

// Nodemon task
export = () => {
  NodeMon.start(
    config.dist.entry,
    config.dist.entry,
    'js, html',
    ['--debug']
  );
};

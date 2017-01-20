import { NodeMon } from '../libs/nodemon';
import Config from '../../config';

// Nodemon task
export = () => {
  NodeMon.start(
    Config.dist.entry,
    Config.dist.entry,
    'js, html',
    ['--debug']
  );
};

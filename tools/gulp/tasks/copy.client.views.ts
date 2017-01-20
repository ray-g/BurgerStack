import * as gulp from 'gulp';

import Config from '../config';

export = () => {
  return gulp.src(Config.client.views, {
    base: Config.client.path
  })
    .pipe(gulp.dest(Config.dist.client));
};

import * as gulp from 'gulp';

const baseAssets = require('../../../config/assets/base');

export = () => {
  return gulp.src(baseAssets.client.views, {
    base: baseAssets.client.path
  })
    .pipe(gulp.dest(baseAssets.dist.client));
};

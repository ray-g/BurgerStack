import * as gulp from 'gulp';

const config = require('../config');

export = () => {
  return gulp.src(config.client.assets, {
    base: config.client.path
  })
    .pipe(gulp.dest(config.dist.client));
};

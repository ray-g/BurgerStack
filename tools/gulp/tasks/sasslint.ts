import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { assetsUnion } from '../../../config/utils';

const plugins = <any>gulpLoadPlugins();
const config = require('../config');

export = () => {
  let assets = assetsUnion(
    config.client.sass
  );

  return gulp.src(assets)
    .pipe(plugins.sassLint({
      configFile: '.sass-lint.yml'
    }))
    .pipe(plugins.sassLint.format())
    .pipe(plugins.sassLint.failOnError());
};

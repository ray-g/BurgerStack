import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { assetsUnion } from '../../../config/utils';

const plugins = <any>gulpLoadPlugins();
const baseAssets = require('../../../config/assets/base');

export = () => {
  let assets = assetsUnion(
    baseAssets.client.sass
  );

  return gulp.src(assets)
    .pipe(plugins.sassLint({
      configFile: '.sass-lint.yml'
    }))
    .pipe(plugins.sassLint.format())
    .pipe(plugins.sassLint.failOnError());
};

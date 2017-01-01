import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { assetsUnion } from '../../../config/utils';

const baseAssets = require('../../../config/assets/base');
const plugins = <any>gulpLoadPlugins();

export = () => {
  let assets = assetsUnion(
    baseAssets.client.systemJSConfig
  );

  return gulp.src(assets)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
};

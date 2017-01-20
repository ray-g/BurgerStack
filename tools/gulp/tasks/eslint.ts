import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { assetsUnion } from '../../../config/utils';
import Config from '../../config';
const plugins = <any>gulpLoadPlugins();

export = () => {
  let assets = assetsUnion(
    Config.client.systemJSConfig
  );

  return gulp.src(assets)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
};

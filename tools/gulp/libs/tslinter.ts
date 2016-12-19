import { join } from 'path';
import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';

const plugins = <any>gulpLoadPlugins();

export class TSLinter {
  private static _instance: TSLinter = new TSLinter();

  private customRules: string[];

  public static getInstance(): TSLinter {
    return TSLinter._instance;
  }

  constructor() {
    if (TSLinter._instance) {
      throw new Error('Error: Instantiation failed: Use TSLinter.getInstance() instead of new.');
    }
    this.customRules = this.initCustomRules();
    TSLinter._instance = this;
  }

  public check(srcAssets: string[]) {
    return gulp.src(srcAssets)
      .pipe(plugins.tslint({
        formatter: 'verbose',
        rulesDirectory: this.customRules
      }))
      .pipe(plugins.tslint.report({
        emitError: require('is-ci')
      }));
  }

  private initCustomRules(): string[] {
    let lintConf = require(join(process.cwd(), 'tslint.json'));
    return lintConf.rulesDirectory;
  }
}

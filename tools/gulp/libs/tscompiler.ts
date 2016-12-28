import { join } from 'path';
import * as merge from 'merge-stream';
import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';

const plugins = <any>gulpLoadPlugins();
const TYPED_COMPILE_INTERVAL = 10;
const MANUAL_TYPINGS = ['./tools/manual_typings/**/*.d.ts'];

export class TSCompiler {
  private static _instance: TSCompiler = new TSCompiler();

  private typedBuildCounter = TYPED_COMPILE_INTERVAL;
  private startTimeBuildCounter = 0;
  private tsConfigFile = '';

  public static getInstance(): TSCompiler {
    return TSCompiler._instance;
  }

  public static compile(srcAssets: string[], destDir: string, configFile: string) {
    return TSCompiler._instance.compile(srcAssets, destDir, configFile);
  }

  constructor() {
    if (TSCompiler._instance) {
      throw new Error('Error: Instantiation failed: Use TSCompiler.getInstance() instead of new.');
    }
    TSCompiler._instance = this;
  }

  private compile(srcAssets: string[], destDir: string, configFile: string) {
    let tsProject: any;
    let typings = gulp.src([...MANUAL_TYPINGS]);
    let src = [...srcAssets];

    let projectFiles = gulp.src(src);
    let result: any;
    let isFullCompile = true;

    this.tsConfigFile = configFile;

    // Only do a typed build every X builds, otherwise do a typeless build to speed things up
    if (this.typedBuildCounter < TYPED_COMPILE_INTERVAL) {
      isFullCompile = false;
      tsProject = this.makeTsProject({ isolatedModules: true });
      projectFiles = projectFiles.pipe(plugins.cached());
      plugins.util.log('Performing typeless TypeScript compile.');
    } else {
      tsProject = this.makeTsProject();
      projectFiles = merge(typings, projectFiles);
    }

    result = projectFiles
      .pipe(plugins.plumber())
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.typescript(tsProject))
      .on('error', () => {
        this.typedBuildCounter = TYPED_COMPILE_INTERVAL;
      });

    if (isFullCompile) {
      this.typedBuildCounter = 0;
    } else {
      this.typedBuildCounter++;
    }

    if (this.startTimeBuildCounter < 3) { // 3 types of compile
      this.typedBuildCounter = TYPED_COMPILE_INTERVAL;
    }

    return result.js
      .pipe(plugins.sourcemaps.write())
      // Use for debugging with Webstorm/IntelliJ
      // https://github.com/mgechev/angular2-seed/issues/1220
      //    .pipe(plugins.sourcemaps.write('.', {
      //      includeContent: false,
      //      sourceRoot: (file: any) =>
      //        relative(file.path, PROJECT_ROOT + '/' + APP_SRC).replace(sep, '/') + '/' + APP_SRC
      //    }))
      // .pipe(plugins.template(Object.assign(
      //   templateLocals(), {
      //     SYSTEM_CONFIG_DEV: jsonSystemConfig
      //   }
      // )))
      .pipe(gulp.dest(destDir));
  }

  private makeTsProject(options: Object = {}) {
    let tsProjects: any = {};
    let optionsHash = JSON.stringify(options);

    if (!tsProjects[optionsHash]) {
      let config = Object.assign({
        typescript: require('typescript')
      }, options);
      tsProjects[optionsHash] =
        plugins.typescript.createProject(join(process.cwd(), this.tsConfigFile), config);
    }

    return tsProjects[optionsHash];
  }
}

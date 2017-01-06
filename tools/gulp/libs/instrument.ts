export function instrument(assets: string | string[], destDir: string, gulp: any, plugins: any, isparta: any, includeAll: boolean) {
  // return new Promise((resolve, reject) => {
    return gulp.src(assets)
      // Covering files
      // .pipe(plugins.sourcemaps.init())
      .pipe(plugins.istanbul({
        // instrumenter: isparta.Instrumenter,
        includeUntested: includeAll
      }))
      // .pipe(gulp.dest(destDir + '/istanbul-tmp'))
      // Force `require` to return covered files
      .pipe(plugins.istanbul.hookRequire());
  // });
}

export function instrument(assets: string | string[], destDir: string, gulp: any, plugins: any, isparta: any) {
  // return new Promise((resolve, reject) => {
    return gulp.src(assets)
      // Covering files
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.istanbul({
        instrumenter: isparta.Instrumenter,
        includeUntested: true
      }))
      // .pipe(gulp.dest(destDir + '/istanbul-tmp'))
      // Force `require` to return covered files
      .pipe(plugins.istanbul.hookRequire());
  // });
}

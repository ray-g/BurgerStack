import * as gulp from 'gulp';
import * as util from 'gulp-util';
import * as runSequence from 'run-sequence';

import { loadTasks } from './tools/utils';
import { NodeMon } from './tools/gulp/libs/nodemon';
import { BrowserSync } from './tools/gulp/libs/browsersync';
import * as baseAssets from './config/assets/base';

loadTasks(baseAssets.tools.gulpTasks);

// Default task
gulp.task('default', (done: any) => {
  runSequence('tslint', done);
});

// Watch Files For Changes
let onChange = (event: any) => {
  console.log('File ' + event.path + ' was ' + event.type);
};

gulp.task('compile', (done: any) => {
  runSequence(['compile.config', 'compile.server', 'compile.entry', 'compile.client'], done);
});

gulp.task('tslint', (done: any) => {
  runSequence(['tslint.config', 'tslint.server', 'tslint.entry', 'tslint.client'], done);
});

gulp.task('watch', () => {
  // Add watch rules
  // All server TS files, do lint and compile, then restart server
  gulp.watch(
    baseAssets.server.ts,
    () => {
      runSequence(['tslint.server', 'compile.server'], NodeMon.reload);
    })
    .on('change', (event: any) => { onChange(event); });

  // Server entry file, do lint and compile, then restart server
  gulp.watch(
    baseAssets.server.entry,
    () => {
      runSequence(['tslint.entry', 'compile.entry'], NodeMon.reload);
    })
    .on('change', (event: any) => { onChange(event); });

  // All config TS files, do lint and compile, then restart server
  gulp.watch(
    baseAssets.config.serverConfig,
    () => {
      runSequence(['tslint.config', 'compile.config'], NodeMon.reload);
    })
    .on('change', (event: any) => { onChange(event); });

  // Client systemJS file, do lint and copy, then reload browser
  gulp.watch(
    baseAssets.client.systemJSConfig,
    () => {
      runSequence(['eslint', 'copy.client'], BrowserSync.reload);
    })
    .on('change', (event: any) => { onChange(event); });

  // All client TS files, do lint and compile, then reload browser
  gulp.watch(
    baseAssets.client.ts,
    () => {
      runSequence(['tslint.client', 'compile.client'], BrowserSync.reload);
    })
    .on('change', (event: any) => { onChange(event); });

  // All client sass files, do lint and compile, then reload browser
  gulp.watch(
    baseAssets.client.sass,
    () => {
      runSequence(['sasslint', 'sass'], BrowserSync.reload);
    })
    .on('change', (event: any) => { onChange(event); });

  // All client html files, do lint and copy, then reload browser
  gulp.watch(
    baseAssets.client.views,
    () => {
      runSequence(['copy.client'], BrowserSync.reload);
    })
    .on('change', (event: any) => { onChange(event); });

  // All client assets files, do copy, then reload browser
  gulp.watch(
    baseAssets.client.assets,
    () => {
      runSequence(['copy.client'], BrowserSync.reload);
    })
    .on('change', (event: any) => { onChange(event); });
});

// Clean dev/coverage that will only run once
// this prevents karma watchers from being broken when directories are deleted
let firstRun = true;
gulp.task('clean.once', (done: any) => {
  if (firstRun) {
    firstRun = false;
    runSequence('clean.dev', 'clean.coverage', done);
  } else {
    util.log('Skipping clean on rebuild');
    done();
  }
});

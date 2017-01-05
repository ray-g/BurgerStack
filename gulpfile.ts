import * as gulp from 'gulp';
import * as util from 'gulp-util';
import * as runSequence from 'run-sequence';

import { loadTasks } from './tools/utils';
import { NodeMon } from './tools/gulp/libs/nodemon';
import { BrowserSync } from './tools/gulp/libs/browsersync';
const config = require('./tools/gulp/config');

loadTasks(config.tools.gulpTasks);

gulp.task('compile', (done: any) => {
  runSequence(['compile.config', 'compile.server', 'compile.entry', 'compile.client'], done);
});

gulp.task('tslint', (done: any) => {
  runSequence(['tslint.config', 'tslint.server', 'tslint.entry', 'tslint.client'], done);
});

gulp.task('lint', (done: any) => {
  runSequence(['tslint', 'eslint', 'sasslint'], done);
});

gulp.task('copy', (done: any) => {
  runSequence(['copy.client.views', 'copy.client.assets'], done);
});

// Build tasks
gulp.task('build', (done: any) => {
  runSequence('lint', 'sass', 'compile', 'copy', done);
});

gulp.task('rebuild', (done: any) => {
  runSequence('clean', 'build', done);
});

// Test tasks
gulp.task('test', (done: any) => {
  runSequence('env.test', 'mocha', done);
});

// Watch Files For Changes
let onChange = (event: any) => {
  console.log('File ' + event.path + ' was ' + event.type);
};

gulp.task('watch', () => {
  // Add watch rules
  // All server TS files, do lint and compile, then restart server
  gulp.watch(
    config.server.ts,
    () => {
      runSequence(['tslint.server', 'compile.server'], NodeMon.reload);
    })
    .on('change', onChange);

  // Server entry file, do lint and compile, then restart server
  gulp.watch(
    config.server.entry,
    () => {
      runSequence(['tslint.entry', 'compile.entry'], NodeMon.reload);
    })
    .on('change', onChange);

  // All config TS files, do lint and compile, then restart server
  gulp.watch(
    config.config.serverConfig,
    () => {
      runSequence(['tslint.config', 'compile.config'], NodeMon.reload);
    })
    .on('change', onChange);

  // Client systemJS file, do lint and copy, then reload browser
  gulp.watch(
    config.client.systemJSConfig,
    () => {
      runSequence(['eslint', 'copy.client'], BrowserSync.reload);
    })
    .on('change', onChange);

  // All client TS files, do lint and compile, then reload browser
  gulp.watch(
    config.client.ts,
    () => {
      runSequence(['tslint.client', 'compile.client'], BrowserSync.reload);
    })
    .on('change', onChange);

  // All client sass files, do lint and compile, then reload browser
  gulp.watch(
    config.client.sass,
    () => {
      runSequence(['sasslint', 'sass'], BrowserSync.reload);
    })
    .on('change', onChange);

  // All client html files, do lint and copy, then reload browser
  gulp.watch(
    config.client.views,
    () => {
      runSequence(['copy.client.views'], BrowserSync.reload);
    })
    .on('change', onChange);

  // All client assets files, do copy, then reload browser
  gulp.watch(
    config.client.assets,
    () => {
      runSequence(['copy.client.assets'], BrowserSync.reload);
    })
    .on('change', onChange);
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

gulp.task('watch.and.serve', (done: any) => {
  runSequence(['nodemon', 'browsersync', 'watch'], done);
});

// Default task
gulp.task('default', (done: any) => {
  runSequence('env.dev', 'build', 'watch.and.serve', done);
});

gulp.task('start', (done: any) => {
  runSequence('env.dev', 'watch.and.serve', done);
});

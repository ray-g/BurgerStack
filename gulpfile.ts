import * as gulp from 'gulp';
import * as util from 'gulp-util';
import * as runSequence from 'run-sequence';

import { loadTasks } from './tools/gulp/task_tools';
import * as baseAssets from './config/assets/base';

loadTasks(baseAssets.config.gulpTasksDir);

// Default task
gulp.task('default', (done: any) => {
  runSequence('tslint', done);
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

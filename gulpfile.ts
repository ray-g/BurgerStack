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
  runSequence('tslint.config', done);
});

// Watch Files For Changes
let onChange = (event: any) => {
  console.log('File ' + event.path + ' was ' + event.type);
};

gulp.task('watch', () => {
  // Add watch rules
  gulp.watch(
    baseAssets.server.ts,
    () => { runSequence(['tslint:server', 'compile:server'], NodeMon.reload);
  })
  .on('change', (event: any) => { onChange(event); });

  gulp.watch(
    baseAssets.config.serverConfig,
    () => { runSequence(['tslint:config', 'compile:config'], NodeMon.reload);
  })
  .on('change', (event: any) => { onChange(event); });

  gulp.watch(
    baseAssets.client.systemJSConfig,
    () => { runSequence(['eslint', 'copy:client'], BrowserSync.reload);
  })
  .on('change', (event: any) => { onChange(event); });

  gulp.watch(
    baseAssets.client.ts,
    () => { runSequence(['tslint:client', 'compile:client'], BrowserSync.reload);
  })
  .on('change', (event: any) => { onChange(event); });

  gulp.watch(
    baseAssets.client.sass,
    () => { runSequence(['sasslint', 'sass'], BrowserSync.reload);
  })
  .on('change', (event: any) => { onChange(event); });

  gulp.watch(
    baseAssets.client.views,
    () => { runSequence(['copy:client'], BrowserSync.reload);
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

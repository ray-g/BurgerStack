import * as gulp from 'gulp';
import * as util from 'gulp-util';
import * as runSequence from 'run-sequence';
import { existsSync, lstatSync } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';

import { loadTasks } from './tools/utils';
import { NodeMon } from './tools/gulp/libs/nodemon';
import { BrowserSync } from './tools/gulp/libs/browsersync';
import Config from './tools/gulp/config';

loadTasks(Config.tools.gulpTasks);

// Clean tasks
gulp.task('clean', (done: any) => {
  runSequence(['clean.dist', 'clean.covreports', 'clean.dll'], done);
});

// Clean dev/coverage that will only run once
// this prevents karma watchers from being broken when directories are deleted
let firstRun = true;
gulp.task('clean.once', (done: any) => {
  if (firstRun) {
    firstRun = false;
    runSequence('clean', done);
  } else {
    util.log('Skipping clean on rebuild');
    done();
  }
});


// Compile tasks
gulp.task('compile', (done: any) => {
  runSequence(['compile.config', 'compile.server', 'compile.entry', 'compile.client'], done);
});

gulp.task('compile.all', (done: any) => {
  runSequence(['compile', 'compile.tools', 'compile.test'], done);
});


// Linter tasks
gulp.task('tslint', (done: any) => {
  runSequence(['tslint.config', 'tslint.server', 'tslint.client', 'tslint.tools', 'tslint.test'], done);
});

gulp.task('lint', (done: any) => {
  runSequence(['tslint', 'eslint', 'sasslint'], done);
});

// Build tasks
gulp.task('build', (done: any) => {
  runSequence('lint', 'sass', 'compile', 'copy', done);
});

gulp.task('rebuild', (done: any) => {
  runSequence('clean', 'build', done);
});

gulp.task('build.prod', (done: any) => {
  runSequence('env.prod', 'clean', 'build', done);
});

gulp.task('copy', (done: any) => {
  runSequence(['copy.client.views', 'copy.client.assets'], done);
});

// Test tasks
gulp.task('karma', (done: any) => {
  runSequence('env.test', 'karma.run', 'karma.report', done);
});

gulp.task('test.client', (done: any) => {
  runSequence('env.test', ['compile.client', 'compile.test'], 'karma.run', 'karma.report', done);
});

gulp.task('test.server', (done: any) => {
  runSequence('env.test', ['compile.server', 'compile.config', 'compile.test'], 'mocha', done);
});

gulp.task('test.tools', (done: any) => {
  runSequence('env.test', 'tslint.tools', 'compile.tools', 'compile.test', 'mocha.tools', done);
});

gulp.task('test', (done: any) => {
  runSequence('env.test', 'clean', 'build', 'compile.tools', 'compile.test', 'mocha', 'karma', done);
});

gulp.task('test.travis', (done: any) => {
  // runSequence('test', 'coveralls', done);
  runSequence('test', done);
});

gulp.task('test.watch', (done: any) => {
  runSequence('test', 'watch', done);
});

gulp.task('test.only', (done: any) => {
  runSequence('env.test', 'clean.covreports', 'tslint.test', 'compile.test', 'mocha', done);
});

// Execute UT on change.
let testSuite: string[] = [];
let prepareTests = (changedPath: string) => {
  // Changed staff should be a TypeScript file, then run its' UT if exists
  let currentDir = process.cwd();
  let re = /(.+)\.ts$/g;
  let target: string;
  if (lstatSync(changedPath).isFile() && changedPath.endsWith('.ts')) {
    if (changedPath.endsWith('.spec.ts')) {
      target = re.exec(join(Config.dist.path, changedPath.replace(currentDir, '')))[1] + '.js';
    } else if (changedPath.endsWith('.e2e.ts')) {
      // TODO: deal with E2E later.
    } else {
      target = re.exec(join(Config.dist.path, changedPath.replace(currentDir, '')))[1] + '.spec.js';
    }

    if (existsSync(target)) {
      testSuite.push(target);
    }
  }
};

gulp.task('testChanged', () => {
  if (testSuite.length > 0) {
    testSuite.forEach((target: string) => {
      let re = /[\s\S]+(Running with:[\s]*\[.+\][\s\S]+)/g;
      console.log('Try execute test with: ' + target);
      let cmd = 'gulp mocha.one -f ' + target;
      exec(cmd, { timeout: 5000 }, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`Execute test: ${re.exec(stdout)[1]}`);
        if (stderr.length > 0) {
          console.error(`stderr: ${stderr}`);
        }
      });
    });
    testSuite = [];
  }
});

// Watch Files For Changes
let onChange = (event: any) => {
  let changedPath = event.path;
  console.log('File ' + changedPath + ' was ' + event.type);

  prepareTests(changedPath);
};

gulp.task('watch', () => {
  // Add watch rules
  // All server TS files, do lint and compile, then restart server
  gulp.watch(
    Config.server.ts,
    () => {
      runSequence(['tslint.server', 'compile.server'], 'testChanged', NodeMon.reload);
    })
    .on('change', onChange)
    .on('error', util.log);

  // Server entry file, do lint and compile, then restart server
  gulp.watch(
    Config.server.entry,
    () => {
      runSequence(['tslint.server', 'compile.entry'], 'testChanged', NodeMon.reload);
    })
    .on('change', onChange)
    .on('error', util.log);

  // All config TS files, do lint and compile, then restart server
  gulp.watch(
    Config.config.serverConfig,
    () => {
      runSequence(['tslint.config', 'compile.config'], 'testChanged', NodeMon.reload);
    })
    .on('change', onChange)
    .on('error', util.log);

  // Client systemJS file, do lint and copy, then reload browser
  gulp.watch(
    Config.client.systemJSConfig,
    () => {
      runSequence(['eslint', 'copy.client'], BrowserSync.reload);
    })
    .on('change', onChange)
    .on('error', util.log);

  // All client TS files, do lint and compile, then reload browser
  gulp.watch(
    Config.client.ts,
    () => {
      runSequence(['tslint.client', 'compile.client'], 'testChanged', BrowserSync.reload);
    })
    .on('change', onChange)
    .on('error', util.log);

  // All client sass files, do lint and compile, then reload browser
  gulp.watch(
    Config.client.sass,
    () => {
      runSequence(['sasslint', 'sass'], BrowserSync.reload);
    })
    .on('change', onChange)
    .on('error', util.log);

  // All client html files, do lint and copy, then reload browser
  gulp.watch(
    Config.client.views,
    () => {
      runSequence(['copy.client.views'], BrowserSync.reload);
    })
    .on('change', onChange)
    .on('error', util.log);

  // All client assets files, do copy, then reload browser
  gulp.watch(
    Config.client.assets,
    () => {
      runSequence(['copy.client.assets'], BrowserSync.reload);
    })
    .on('change', onChange)
    .on('error', util.log);

  // Tools and Tests files, do lint and compile.
  gulp.watch(
    Config.tests.ts.all,
    () => {
      runSequence(['tslint.test', 'compile.test'], 'testChanged');
    })
    .on('change', onChange)
    .on('error', util.log);

  gulp.watch(
    Config.tools.allTS,
    () => {
      runSequence(['tslint.tools', 'compile.tools'], 'testChanged');
    })
    .on('change', onChange)
    .on('error', util.log);
});

gulp.task('watch.and.serve', (done: any) => {
  runSequence(['nodemon', 'browsersync', 'watch'], done);
});

// Default task
gulp.task('default', (done: any) => {
  runSequence('env.dev', 'rebuild', 'watch.and.serve', done);
});

gulp.task('start', (done: any) => {
  runSequence('env.dev', 'watch.and.serve', done);
});

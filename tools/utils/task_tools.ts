import { lstatSync } from 'fs';
import * as gulp from 'gulp';
import * as util from 'gulp-util';
import * as isstream from 'isstream';
import * as tildify from 'tildify';
import { resolve } from 'path';
import { getGlobbedPaths } from './common';

/**
 * Loads the tasks within the given path.
 * @param {string} tasks - The globber to load the tasks from.
 */
export function loadTasks(tasks: string): void {
  const TASKS = getGlobbedPaths(tasks, []);

  util.log('Loading tasks:', util.colors.yellow(tasks));
  // readDir(path, taskname => registerTask(taskname, path));
  TASKS.forEach( file => {
    if (lstatSync(file).isFile()) {
      registerTask(file);
    }
  });
}

/**
 * Registers the task by the given taskname and path.
 * @param {string} file - The path of the task.
 */
function registerTask(file: string): void {
  let re = /.+\/(.+)\.ts$/g;
  let taskname = re.exec(file)[1];

  util.log('Registering task', util.colors.yellow(tildify(file)), 'as', util.colors.yellow(taskname));

  gulp.task(taskname, (done: any) => {
    const task = require(resolve(file));
    if (task.length > 0) {
      return task(done);
    }

    const taskReturnedValue = task();
    if (isstream(taskReturnedValue)) {
      return taskReturnedValue;
    }

    // TODO: add promise handling if needed at some point.

    done();
  });
}

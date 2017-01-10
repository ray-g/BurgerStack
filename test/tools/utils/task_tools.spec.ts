import { expect } from 'chai';
import sinon = require('sinon');
import { resolve } from 'path';
import * as taskTools from '../../../tools/utils/task_tools';

import * as gulp from 'gulp';
import * as util from 'gulp-util';
import * as utilsCommon from '../../../config/utils/common';
import * as fs from 'fs';
import mockRequire = require('mock-require');
let stream = require('stream');

describe('tools/utils/task_tools', () => {

  describe('loadTasks()', () => {
    let gulpTask: any;
    let fileStats: any = {};
    let stubs: any[] = [];
    let tasks: string[] = [];

    beforeEach(() => {
      gulpTask = sinon.stub(gulp, 'task');
      stubs.push(sinon.stub(util, 'log', () => { }));
      stubs.push(sinon.stub(fs, 'lstatSync').returns(fileStats));
      fileStats.isFile = function () { return true; };
    });

    afterEach(() => {
      gulpTask.restore();
      stubs.forEach((stub) => {
        stub.restore();
      });
      stubs = [];
    });

    it('should register correct task', () => {
      tasks = ['tasks/dot.in.name.ts', 'tasks/noDotName.ts'];
      stubs.push(sinon.stub(utilsCommon, 'getGlobbedPaths').returns(tasks));

      taskTools.loadTasks('path/to/tasks/*.ts');
      expect(gulpTask.calledWith('dot.in.name')).to.be.true;
      expect(gulpTask.calledWith('noDotName')).to.be.true;
    });

    it('should not register any task if target is not a file', () => {
      fileStats.isFile = function () { return false; };
      tasks = ['tasks/dot.in.name.ts', 'tasks/noDotName.ts'];
      stubs.push(sinon.stub(utilsCommon, 'getGlobbedPaths').returns(tasks));

      taskTools.loadTasks('path/to/tasks/*.ts');
      expect(gulpTask.notCalled);
    });

    it('should call default done() if task has not receives callback and return nothing', () => {
      gulpTask.restore();
      let spy = sinon.spy();
      gulpTask = sinon.stub(gulp, 'task', (name: string, cb: any) => { cb(spy); });
      tasks = ['tasks/fake.task.ts'];
      stubs.push(sinon.stub(utilsCommon, 'getGlobbedPaths').returns(tasks));
      mockRequire(resolve('tasks/fake.task.ts'), () => { });

      taskTools.loadTasks('path/to/tasks/*.ts');
      expect(spy.calledOnce).to.be.true;
    });

    it('should call task with done() if task receives callback', () => {
      gulpTask.restore();
      let spy = sinon.spy();
      let task = function(done: any) { done(); };
      gulpTask = sinon.stub(gulp, 'task', (name: string, cb: any) => { cb(spy); });
      tasks = ['tasks/fake.task.ts'];
      stubs.push(sinon.stub(utilsCommon, 'getGlobbedPaths').returns(tasks));
      mockRequire(resolve('tasks/fake.task.ts'), task);

      taskTools.loadTasks('path/to/tasks/*.ts');
      expect(spy.called).to.be.true;
    });

    it('should return stream value if in stream', () => {
      gulpTask.restore();
      let retCode = 0;
      let spy = sinon.spy();
      let retStream = new stream.Stream();
      let task = function() { return retStream; };
      gulpTask = sinon.stub(gulp, 'task', (name: string, cb: any) => { retCode = cb(spy); });
      tasks = ['tasks/fake.task.ts'];
      stubs.push(sinon.stub(utilsCommon, 'getGlobbedPaths').returns(tasks));
      mockRequire(resolve('tasks/fake.task.ts'), task);

      taskTools.loadTasks('path/to/tasks/*.ts');
      expect(retCode).to.equal(retStream);
    });
  });
});

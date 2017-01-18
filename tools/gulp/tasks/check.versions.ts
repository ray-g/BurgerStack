import * as util from 'gulp-util';
import * as Config from '../config';

function reportError(message: string) {
  console.error(util.colors.white.bgRed.bold(message));
  process.exit(1);
}

/**
 * Executes the build process, verifying that the installed NodeJS and NPM version matches the required versions as
 * defined in the application configuration.
 */
export = () => {
  let exec = require('child_process').exec;
  let semver = require('semver');

  exec('npm --version',
    function (error: Error, stdout: NodeBuffer, stderr: NodeBuffer) {
      if (error !== null) {
        reportError('npm preinstall error: ' + error + stderr);
      }

      if (!semver.gte(stdout, Config.Node.NodeVersion)) {
        reportError('NPM is not in required version! Required is ' + Config.Node.NpmVersion + ' and you\'re using ' + stdout);
      }
    });

  exec('node --version',
    function (error: Error, stdout: NodeBuffer, stderr: NodeBuffer) {
      if (error !== null) {
        reportError('npm preinstall error: ' + error + stderr);
      }

      if (!semver.gte(stdout, Config.Node.NodeVersion)) {
        reportError('NODE is not in required version! Required is ' + Config.Node.NodeVersion + ' and you\'re using ' + stdout);
      }
    });
};

import * as _ from 'lodash';
import * as glob from 'glob';

/**
  * Get files by glob patterns
  */
export function getGlobbedPaths(globPatterns: any, excludes: any): any[] {
  // URL paths regex
  let urlRegex = new RegExp('^(?:[a-z]+:)?//', 'i');

  // The output array
  let output: any[] = [];

  // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(function (globPattern) {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      let files = glob.sync(globPatterns);
      if (excludes) {
        files = files.map(function (file: any) {
          if (_.isArray(excludes)) {
            excludes.forEach(function (item) {
              file = file.replace(item, '');
            });
            for (let i in excludes) {
              if (excludes.hasOwnProperty(i)) {
                file = file.replace(excludes[i], '');
              }
            }
          } else {
            file = file.replace(excludes, '');
          }
          return file;
        });
      }
      output = _.union(output, files);
    }
  }

  return output;
};

/**
  * Wrapper lodash.union to return a string[] to pass to a gulp.src.
  * To avoid error: cannot assign {}[] to string[].
  */
export function assetsUnion(...args: any[]): string[] {
  return <string[]>_.union(...args);
}

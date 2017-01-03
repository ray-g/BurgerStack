export function isStringArray(value: any) {
  let isStrArr = true;
  if (value instanceof Array) {
    if (value.length < 1) {
      isStrArr = false;
    } else {
      value.forEach((item) => {
        if (typeof item !== 'string') {
          isStrArr = false;
          return;
        }
      });
    }
  } else {
    isStrArr = false;
  }
  return isStrArr;
}

export function isStringArray(value: any) {
  let isStrArr = true;
  if (value instanceof Array) {
    value.forEach((item) => {
      if (typeof item !== 'string') {
        isStrArr = false;
        return;
      }
    });
  }
  return isStrArr;
}

export function isStringArray(value: any) {
  let isStrArr = true;
  if (value instanceof Array && value.length > 0) {
    value.forEach((item) => {
      if (typeof item !== 'string') {
        isStrArr = false;
        return;
      }
    });
  } else {
    isStrArr = false;
  }
  return isStrArr;
}

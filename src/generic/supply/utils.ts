export const isArrayEqual = <T1 extends unknown[]>(a: T1, b: T1): boolean => {
  if (a === b) {
    return true;
  }

  if (a.length === b.length) {
    for (let i = 0, l = a.length; i < l; ++i) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }

  return false;
};

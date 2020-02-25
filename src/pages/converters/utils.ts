export const nanToUndefined = (str: string | number): number | undefined => {
  if (str === '' || str === undefined || str === null) {
    return undefined;
  }

  const value = Number(str);

  return Number.isNaN(value) || !Number.isFinite(value) ? undefined : value;
};

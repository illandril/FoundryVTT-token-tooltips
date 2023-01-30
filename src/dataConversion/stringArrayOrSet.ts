const stringArrayOrSet = (value: unknown) => {
  if (Array.isArray(value) || value instanceof Set) {
    const asArray: string[] = [];
    for (const entry of value) {
      if (typeof entry !== 'string') {
        return null;
      }
      asArray.push(entry);
    }
    return asArray;
  }
  return null;
};

export default stringArrayOrSet;

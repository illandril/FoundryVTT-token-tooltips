const stringArray = (value: unknown) => {
  if (!Array.isArray(value)) {
    return null;
  }
  for (const entry of value) {
    if (typeof entry !== 'string') {
      return null;
    }
  }
  return value as string[];
};

export default stringArray;

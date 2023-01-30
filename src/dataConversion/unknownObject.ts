const unknownObject = (value: unknown) => {
  if (value !== null && typeof value === 'object') {
    return value as Record<string, unknown>;
  }
  return null;
};

export default unknownObject;

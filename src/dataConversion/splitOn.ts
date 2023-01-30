const splitOn = (value: unknown, character: string | RegExp) => {
  if (typeof value === 'string') {
    return value.split(character);
  }
  return null;
};

export default splitOn;

const string = (value: unknown) => {
  if (typeof value !== 'string') {
    return null;
  }
  return value;
};

export default string;

const isNumberLikeValue = (value: unknown): value is string | number => {
  let valueAsFloat: number;
  if (typeof value === 'number') {
    valueAsFloat = value;
  } else if (typeof value === 'string') {
    valueAsFloat = Number.parseFloat(value);
  } else {
    return false;
  }
  return !Number.isNaN(valueAsFloat);
};

export default isNumberLikeValue;

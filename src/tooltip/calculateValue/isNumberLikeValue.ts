const isNumberLikeValue = (value: unknown) => {
  let valueAsFloat: number;
  if (typeof value === 'number') {
    valueAsFloat = value;
  } else if (typeof value === 'string') {
    valueAsFloat = parseFloat(value);
  } else {
    return false;
  }
  return !isNaN(valueAsFloat);
};

export default isNumberLikeValue;

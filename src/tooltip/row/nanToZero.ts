const nanToZero = (value: unknown) => {
  if (!value) {
    return 0;
  }
  let valueAsFloat: number;
  if (typeof value === 'number') {
    valueAsFloat = value;
  } else if (typeof value === 'string') {
    valueAsFloat = parseFloat(value);
  } else {
    valueAsFloat = NaN;
  }
  if (isNaN(valueAsFloat)) {
    return 0;
  }
  return valueAsFloat;
};

export default nanToZero;

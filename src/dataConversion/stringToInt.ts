const intPattern = /^-?[0-9]+$/;

const stringToInt = (value: string) => {
  if (intPattern.test(value)) {
    const numberValue = Number.parseInt(value, 10);
    if (!Number.isNaN(numberValue)) {
      return numberValue;
    }
  }
  return null;
};

export default stringToInt;

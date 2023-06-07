const intPattern = /^-?[0-9]+$/;

const stringToInt = (value: string) => {
  if (intPattern.test(value)) {
    const numberValue = parseInt(value, 10);
    if (!isNaN(numberValue)) {
      return numberValue;
    }
  }
  return null;
};

export default stringToInt;

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Legacy
const numberToNiceString = (value: number) => {
  let string: string;
  if (value === 0.125) {
    string = '⅛';
  } else if (value === 0.25) {
    string = '¼';
  } else if (value === 0.375) {
    string = '⅜';
  } else if (value === 0.5) {
    string = '½';
  } else if (value === 0.625) {
    string = '⅝';
  } else if (value === 0.75) {
    string = '¾';
  } else if (value === 0.875) {
    string = '⅞';
  } else if (value >= 0.166 && value <= 0.167) {
    string = '⅙';
  } else if (value >= 0.333 && value <= 0.334) {
    string = '⅓';
  } else if (value >= 0.666 && value <= 0.667) {
    string = '⅔';
  } else if (value >= 0.833 && value <= 0.834) {
    string = '⅚';
  } else {
    string = new Intl.NumberFormat(navigator.language, { maximumFractionDigits: 3 }).format(value);
  }
  return string;
};

export default numberToNiceString;

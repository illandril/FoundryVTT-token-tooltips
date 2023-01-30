
import icon from '../../html/icon';
import span from '../../html/span';
import module from '../../module';
import { CalculatedValue } from '../../tooltip/calculateValue';

const CSS_HP_HEARTS = module.cssPrefix.child('hp-hearts');

const simplifyToHearts = (rawValue: CalculatedValue, numHearts: number) => {
  const value = rawValue;
  if (typeof value.value === 'number' && typeof value.max === 'number') {
    const percent = value.value / value.max;

    // 4-Hearts - 0 = 0, 1-24 = 1, 25-49 = 2, 50-74 = 3, 75-100 = 4
    // 5-Hearts - 0 = 0, 1-19 = 1, 20-39 = 2, 40-59 = 3, 60-79 = 4, 80-100 = 5
    // const shownHearts = percent === 0 ? 0 : Math.floor(percent * numHearts) + 1;

    // 4-Hearts - 0 = 0, 1-25 = 1, 26-50 = 2, 51-75 = 3, 76-100 = 4
    // 5-Hearts - 0 = 0, 1-20 = 1, 21-40 = 2, 41-60 = 3, 61-80 = 4, 81-100 = 5
    const shownHearts = Math.ceil(percent * numHearts);
    const node = span(CSS_HP_HEARTS);
    for (let i = 1; i <= numHearts; i++) {
      node.appendChild(icon('heart', i > shownHearts));
    }
    return {
      value: node,
    };
  }
  return value;
};

export default simplifyToHearts;

import stringToInt from '../../dataConversion/stringToInt';
import calculateValue, { CalculatedValue } from '../calculateValue';

const getSingleValue = (actor: Actor, rawAttributeKey: string): CalculatedValue | null => {
  const attributeKey = rawAttributeKey.trim();
  const valueAsInt = stringToInt(attributeKey);
  if (valueAsInt !== null) {
    return { value: valueAsInt };
  }
  const attribute = foundry.utils.getProperty(actor, attributeKey);
  return calculateValue(attribute, attributeKey);
};

export default getSingleValue;

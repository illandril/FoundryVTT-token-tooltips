import { CalculatedValue, ValidAttributeType } from './Types';

const calculateValidAttributeValue = (
  attribute: ValidAttributeType,
  attributeKey: string,
): CalculatedValue => {
  let value;
  if (Array.isArray(attribute)) {
    value = Array.prototype.join.call(attribute, ', ');
  } else if (typeof attribute === 'number' && attributeKey.endsWith('.pct')) {
    value = attribute.toFixed(2) + '%';
  } else {
    value = attribute;
  }
  return {
    value,
  };
};

export default calculateValidAttributeValue;

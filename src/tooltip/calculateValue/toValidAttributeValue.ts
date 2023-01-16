import toValidNonArrayAttributeValue from './toValidNonArrayAttributeValue';
import { ValidAttributeType, ValidNonArrayAttributeType } from './Types';

const toValidAttributeValue = (value: unknown): ValidAttributeType | null => {
  const validNonArrayValue = toValidNonArrayAttributeValue(value);
  if (validNonArrayValue !== null) {
    return validNonArrayValue;
  }
  if (Array.isArray(value)) {
    const mapped = Array.prototype.map.call(value, toValidNonArrayAttributeValue);
    if (mapped.length > 0 && mapped.every((entry) => entry !== null)) {
      return mapped as ValidNonArrayAttributeType[];
    }
  }
  return null;
};

export default toValidAttributeValue;

import { ValidNonArrayAttributeType } from './Types';

const toValidNonArrayAttributeValue = (value: unknown): ValidNonArrayAttributeType | null => {
  if (value === null || value === '') {
    return null;
  }
  if (value instanceof Node) {
    return value;
  }
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  if (typeof value === 'string' || typeof value === 'boolean') {
    return value;
  }
  return null;
};

export default toValidNonArrayAttributeValue;

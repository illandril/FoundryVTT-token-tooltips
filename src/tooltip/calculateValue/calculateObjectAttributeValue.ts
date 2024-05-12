import htmlToNode from '../../html/htmlToNode';
import module from '../../module';
import calculateValidAttributeValue from './calculateValidAttributeValue';
import isNumberLikeValue from './isNumberLikeValue';
import toValidAttributeValue from './toValidAttributeValue';
import toValidNonArrayAttributeValue from './toValidNonArrayAttributeValue';
import type { CalculatedValue, MaybeAttributeObject, ValidNonArrayAttributeType } from './types';

const extractValue = (attribute: MaybeAttributeObject, hasMax: boolean) => {
  module.logger.debug('extractValue', attribute, hasMax);

  let value: ValidNonArrayAttributeType | null;
  const total = toValidNonArrayAttributeValue(attribute.total);
  if (total !== null) {
    module.logger.debug('extractValue: attribute.total', total);
    return total;
  }

  const current = toValidNonArrayAttributeValue(attribute.current);
  if (current !== null) {
    module.logger.debug('extractValue: attribute.current', current);
    return current;
  }

  const dotValue = toValidAttributeValue(attribute.value);
  module.logger.debug('extractValue: attribute.value', dotValue);
  if (typeof dotValue === 'string' && attribute.type === 'LongText') {
    module.logger.debug('extractValue: attribute.value was a LongText type');
    value = htmlToNode(dotValue);
  } else if (Array.isArray(dotValue)) {
    module.logger.debug('extractValue: attribute.value was an Array type');
    return dotValue;
  } else if (dotValue === null && hasMax) {
    module.logger.debug('extractValue: attribute.value was null, but had max');
    value = 0;
  } else {
    value = dotValue;
  }
  return value;
};

const calculateTempValue = (value: unknown, temp: unknown) => {
  let calculated: string | number | null;
  if (isNumberLikeValue(value) && isNumberLikeValue(temp)) {
    calculated = temp;
  } else {
    calculated = null;
  }
  return calculated;
};

const stringOrNull = (value: unknown) => {
  return typeof value === 'string' ? value : null;
};

const calculateObjectAttributeValue = (
  attribute: MaybeAttributeObject,
  attributeKey: string,
): CalculatedValue | null => {
  module.logger.debug('calculateObjectAttributeValue', attributeKey, attribute);

  const max = toValidNonArrayAttributeValue(attribute.max);
  const value = extractValue(attribute, max !== null);
  if (value === null) {
    module.logger.debug('calculateObjectAttributeValue: extracted value was null');
    return null;
  }
  if (Array.isArray(value)) {
    module.logger.debug('calculateObjectAttributeValue: extracted value was an array');
    return calculateValidAttributeValue(value, attributeKey);
  }

  const temp = calculateTempValue(value, attribute.temp);
  const tempmax = calculateTempValue(max, attribute.tempmax);
  const units = stringOrNull(attribute.units);
  const extra = stringOrNull(attribute.extra);

  module.logger.debug(
    'calculateObjectAttributeValue',
    'value',
    value,
    'max',
    max,
    'temp',
    temp,
    'tempmax',
    tempmax,
    'units',
    units,
    'extra',
    extra,
  );

  return { value, max, temp, tempmax, units, extra };
};

export default calculateObjectAttributeValue;

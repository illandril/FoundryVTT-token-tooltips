import module from '../../module';
import calculateObjectAttributeValue from './calculateObjectAttributeValue';
import calculateValidAttributeValue from './calculateValidAttributeValue';
import toValidAttributeValue from './toValidAttributeValue';
import type { CalculatedValue, MaybeAttributeObject } from './types';

export * from './types';

const calculateValue = (attribute: unknown, attributeKey = ''): CalculatedValue | null => {
  module.logger.debug('calculateValue', attributeKey, attribute);
  if (attribute === undefined || attribute === null) {
    module.logger.debug('calculateValue: attribute is undefined or null', attribute);
    return null;
  }

  const validAttributeValue = toValidAttributeValue(attribute);
  if (validAttributeValue !== null) {
    module.logger.debug('calculateValue: attribute is validAttributeValue', validAttributeValue);
    return calculateValidAttributeValue(validAttributeValue, attributeKey);
  }

  if (typeof attribute === 'object') {
    module.logger.debug('calculateValue: attribute is object');
    return calculateObjectAttributeValue(attribute as MaybeAttributeObject, attributeKey);
  }
  module.logger.debug('calculateValue: attribute is invalid');
  return null;
};

export default calculateValue;

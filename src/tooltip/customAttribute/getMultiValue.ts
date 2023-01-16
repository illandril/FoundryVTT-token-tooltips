import { CalculatedValue } from '../calculateValue';
import getSingleValue from './getSingleValue';
import { add, getOperation, Operation } from './operations';

const getMultiValue = (actor: Actor, rawAttributeKey: string): CalculatedValue | null => {
  const attributeKeys = rawAttributeKey.replace(/\s*(\+|-|\*|\/|%|[<>!=]=?-?)\s*/g, '~$1~').split('~');
  let valueSoFar = 0;
  let negate = false;
  let operation: Operation = add;
  let fullValue;
  let hadOperation = false;
  for (const attributeKey of attributeKeys) {
    if (attributeKey.trim() === '') {
      continue;
    } else if (attributeKey === '-') {
      hadOperation = true;
      negate = true;
      continue;
    } else {
      const maybeOperation = getOperation(attributeKey);
      if (maybeOperation) {
        hadOperation = true;
        operation = maybeOperation;
        negate = false;
        continue;
      }
    }
    const keyValue = getSingleValue(actor, attributeKey);
    fullValue = keyValue;
    if (!keyValue || typeof keyValue.value !== 'number') {
      return hadOperation ? null : keyValue;
    }
    const thisValue = (negate ? -1 : 1) * keyValue.value;
    negate = false;
    const result = operation(valueSoFar, thisValue);
    if (result === null || isNaN(result)) {
      return null;
    }
    valueSoFar = result;
    operation = add;
  }
  if (!hadOperation) {
    return fullValue ?? null;
  }
  return { value: valueSoFar };
};

export default getMultiValue;

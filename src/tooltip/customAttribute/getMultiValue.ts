import { CalculatedValue } from '../calculateValue';
import { appendValue } from '../row/addValue';
import getSingleValue from './getSingleValue';
import { add, getOperation, Operation } from './operations';

const stringPattern = /^\s*["'`](.+)["'`]\s*$/;
const parenPattern = /^\s*[(](.+)[)]\s*$/;
const mathPattern = /\s*(\+|-|\*|\/|%|[<>!=]=?-?)\s*/g;

const normalizeAttributeKey = (rawAttributeKey: string) => {
  return rawAttributeKey
    .replace(parenPattern, '$1')
    .replace(mathPattern, '~$1~')
    .split('~');
};

const getMultiValuePart = (actor: Actor, rawAttributeKey: string): CalculatedValue | null => {
  const stringMatch = stringPattern.exec(rawAttributeKey);
  if (stringMatch) {
    return { value: stringMatch[1] };
  }

  const attributeKeys = normalizeAttributeKey(rawAttributeKey);

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

const getMultiValue = (actor: Actor, rawAttributeKey: string): CalculatedValue | null => {
  const sections = rawAttributeKey.split('&');
  if (sections.length === 1) {
    return getMultiValuePart(actor, rawAttributeKey);
  }
  const fragment = document.createDocumentFragment();
  for (const section of sections) {
    if (section.trim() === '') {
      continue;
    }
    const part = getMultiValuePart(actor, section);
    if (!part) {
      return null;
    }
    appendValue(fragment, part.value);
  }
  return {
    value: fragment,
  };
};

export default getMultiValue;

import type { CalculatedValue } from '../calculateValue';
import { appendValue } from '../row/addValue';
import getSingleValue from './getSingleValue';
import { type Operation, add, getOperation } from './operations';

const stringPattern = /^\s*["'`](.+)["'`]\s*$/;
const parenPattern = /^\s*[(](.+)[)]\s*$/;
const mathPattern = /\s*(\+|-|\*|\/|%|[<>!=]=?-?)\s*/g;

const normalizeAttributeKey = (rawAttributeKey: string) => {
  return rawAttributeKey.replace(parenPattern, '$1').replace(mathPattern, '~$1~').split('~');
};

const getAsSingleValue = (actor: Actor, rawAttributeKey: string): CalculatedValue | null => {
  const keyValue = getSingleValue(actor, rawAttributeKey);
  if (keyValue) {
    return keyValue;
  }

  const stringMatch = stringPattern.exec(rawAttributeKey);
  if (stringMatch) {
    return { value: stringMatch[1] };
  }
  return null;
};

const extractNextKeyData = (actor: Actor, attributeKeys: string[], startIndex: number) => {
  let attributeKey = '';
  for (let i = startIndex; i < attributeKeys.length; i++) {
    attributeKey += attributeKeys[i];
    const value = getSingleValue(actor, attributeKey);
    if (value) {
      return {
        attributeKey,
        value,
        endIndex: i,
      };
    }
  }
  return {
    attributeKey: attributeKeys[startIndex],
    value: null,
    endIndex: startIndex,
  };
};

const extractNextKey = (actor: Actor, attributeKeys: string[], startIndex: number) => {
  const { attributeKey, value, endIndex } = extractNextKeyData(actor, attributeKeys, startIndex);

  if (attributeKey.trim() === '') {
    return {
      attributeKey,
      value: null,
      endIndex,
      skip: true,
    };
  }
  if (attributeKey === '-') {
    return {
      attributeKey,
      value: null,
      endIndex,
      negate: true,
      skip: true,
    };
  }
  const maybeOperation = getOperation(attributeKey);
  if (maybeOperation) {
    return {
      attributeKey,
      value: null,
      endIndex,
      negate: false,
      operation: maybeOperation,
      skip: true,
    };
  }

  return {
    attributeKey,
    value,
    endIndex,
  };
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Legacy
const getMultiValuePart = (actor: Actor, rawAttributeKey: string): CalculatedValue | null => {
  const asSingleValue = getAsSingleValue(actor, rawAttributeKey);
  if (asSingleValue) {
    return asSingleValue;
  }
  const attributeKeys = normalizeAttributeKey(rawAttributeKey);

  let valueSoFar = 0;
  let negate = false;
  let operation: Operation = add;
  let fullValue: CalculatedValue | null | undefined;
  let hadOperation = false;
  for (let i = 0; i < attributeKeys.length; i++) {
    const extracted = extractNextKey(actor, attributeKeys, i);
    i = extracted.endIndex;
    if (typeof extracted.negate === 'boolean') {
      negate = extracted.negate;
      hadOperation = true;
    }
    if (extracted.operation) {
      operation = extracted.operation;
      hadOperation = true;
    }
    if (extracted.skip) {
      continue;
    }
    const keyValue = extracted.value;
    fullValue = keyValue;
    if (!keyValue || typeof keyValue.value !== 'number') {
      return hadOperation ? null : keyValue;
    }
    const thisValue = (negate ? -1 : 1) * keyValue.value;
    negate = false;
    const result = operation(valueSoFar, thisValue);
    if (result === null || Number.isNaN(result)) {
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

import AttributeRow, { calculateValue } from './attribute-row.js';

const imageKeyPattern = /^(.+\.)?(img|image)$/i;

const isImageKey = (key) => {
  return imageKeyPattern.test(key);
};

const intPattern = /^-?[0-9]+$/;

const getValue = (actor, rawAttributeKey) => {
  const attributeKey = rawAttributeKey.trim();
  if (intPattern.test(attributeKey)) {
    const asInt = parseInt(attributeKey, 10);
    if (!isNaN(asInt)) {
      return { value: asInt };
    }
  }
  const attribute = getProperty(actor, attributeKey);
  return calculateValue(attribute, attributeKey);
};

const operations = new Map();
operations.set('+', (a, b) => a + b);
operations.set('*', (a, b) => a * b);
operations.set('/', (a, b) => b === 0 ? null : a / b);
operations.set('%', (a, b) => a % b);
operations.set('>', (a, b) => (a > b ? a : null));
operations.set('>=', (a, b) => (a >= b ? a : null));
operations.set('<', (a, b) => (a < b ? a : null));
operations.set('<=', (a, b) => (a <= b ? a : null));
operations.set('!=', (a, b) => (a !== b ? a : null));
operations.set('==', (a, b) => (a === b ? a : null));

const getMultiValue = (actor, rawAttributeKey) => {
  const attributeKeys = rawAttributeKey.replace(/\s*(\+|\-|\*|\/|%|[<>!=]=?\-?)\s*/g, '~$1~').split('~');
  let valueSoFar = 0;
  let negate = false;
  let operation = operations.get('+');
  let fullValue;
  let hadOperation = false;
  for (let attributeKey of attributeKeys) {
    if (attributeKey === '-') {
      hadOperation = true;
      negate = true;
      continue;
    } else if (operations.has(attributeKey)) {
      hadOperation = true;
      operation = operations.get(attributeKey);
      negate = false;
      continue;
    } else if (attributeKey.trim() === '') {
      continue;
    }
    const keyValue = getValue(actor, attributeKey);
    fullValue = keyValue;
    if (!keyValue || typeof keyValue.value !== 'number') {
      return null;
    }
    const thisValue = (negate ? -1 : 1) * keyValue.value;
    negate = false;
    valueSoFar = operation(valueSoFar, thisValue);
    if (isNaN(valueSoFar) || typeof valueSoFar !== 'number') {
      return null;
    }
    operation = operations.get('+');
  }
  if (!hadOperation) {
    return fullValue
  }
  return { value: valueSoFar };
};

export const updateCustomAttributeRow = (actor, customRow, customRows, i) => {
  const attributeKey = customRow.attributeKey;
  let value = getMultiValue(actor, attributeKey);
  if (!value) {
    return null;
  }
  if (isImageKey(attributeKey) && typeof value.value === 'string') {
    const src = value.value;
    value.value = new Image();
    value.value.src = src;
    value.value.alt = src;
  }

  const name = customRow.name;
  const iconElem = customRow.icon;
  let row;
  if (!customRows[i]) {
    row = new AttributeRow(name, iconElem);
    customRows[i] = row;
  } else {
    row = customRows[i];
    row.setNameAndIcon(name, iconElem);
  }
  row.setValue(value);
  return row;
};

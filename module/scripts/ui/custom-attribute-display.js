import AttributeRow, { calculateValue } from './attribute-row.js';

const imageKeyPattern = /^(.+\.)?(img|image)$/i;

const isImageKey = (key) => {
  return imageKeyPattern.test(key);
};

const intPattern = /^[0-9]+$/;

const getValue = (actor, rawAttributeKey) => {
  const attributeKey = rawAttributeKey.trim();
  if(intPattern.test(attributeKey)) {
    const asInt = parseInt(attributeKey, 10);
    if(!isNaN(asInt)) {
      return { value: asInt };
    }
  }
  const attribute = getProperty(actor.data, attributeKey);
  return calculateValue(attribute, attributeKey);
};

const getMultiValue = (actor, rawAttributeKey) => {
  console.log(rawAttributeKey);
  const attributeKeys = rawAttributeKey.replace('+', '~+~').replace('-', '~-~').split('~');
  let valueSoFar = 0;
  let addNext = true;
  for(let attributeKey of attributeKeys) {
    console.log(attributeKey);
    if(attributeKey === '+') {
      addNext = true;
      continue;
    } else if(attributeKey === '-') {
      addNext = false;
      continue;
    } else if (attributeKey.trim() === '') {
      continue;
    }
    const keyValue = getValue(actor, attributeKey);
    console.dir(keyValue);
    if(!keyValue || typeof(keyValue.value) !== 'number') {
      return null;
    }
    if (addNext) {
      valueSoFar += keyValue.value;
    } else {
      valueSoFar -= keyValue.value;
    }
  }
  return { value: valueSoFar };
}

export const updateCustomAttributeRow = (actor, customRow, customRows, i) => {
  const attributeKey = customRow.attributeKey;
  let value;
  if(attributeKey.includes('+') || attributeKey.includes('-')) {
    value = getMultiValue(actor, attributeKey);
  } else {
    value = getValue(actor, attributeKey);
  }
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

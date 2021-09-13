import AttributeRow, { calculateValue } from './attribute-row.js';

const imageKeyPattern = /^(.+\.)?(img|image)$/i;

const isImageKey = (key) => {
  return imageKeyPattern.test(key);
};

export const updateCustomAttributeRow = (actor, customRow, customRows, i) => {
  const attributeKey = customRow.attributeKey;
  const attribute = getProperty(actor.data, attributeKey);
  const value = calculateValue(attribute, attributeKey);
  if (!value) {
    return null;
  }
  if ( isImageKey(attributeKey) && typeof(value.value) === 'string') {
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

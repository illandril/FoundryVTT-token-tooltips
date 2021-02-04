import AttributeRow, { calculateValue } from './attribute-row.js';

export const updateCustomAttributeRow = (actor, customRow, customRows, i) => {
  const attributeKey = customRow.attributeKey;
  const attribute = getProperty(actor.data, attributeKey);
  const value = calculateValue(attribute, attributeKey);
  if (!value) {
    return null;
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
  row.setValue(value.value, value.max, value.temp, value.tempMax);
  return row;
};

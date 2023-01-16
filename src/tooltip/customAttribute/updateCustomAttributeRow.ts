import module from '../../module';
import { CustomOption } from '../../settings/CustomOptions';
import AttributeRow from '../row/AttributeRow';
import getMultiValue from './getMultiValue';
import isImageKey from './isImageKey';

const toImage = (value: string) => {
  const image = new Image();
  image.src = value;
  image.alt = value;
  return image;
};

const updateCustomAttributeRow = (
  actor: Actor, customRow: CustomOption, customRows: AttributeRow[], index: number,
) => {
  const attributeKey = customRow.attributeKey;
  const value = getMultiValue(actor, attributeKey);
  module.logger.debug('updateCustomAttributeRow', attributeKey, value);
  if (!value) {
    return null;
  }
  if (isImageKey(attributeKey) && typeof value.value === 'string') {
    value.value = toImage(value.value);
  }

  const name = customRow.name;
  const iconElem = customRow.icon;
  let row;
  if (!customRows[index]) {
    row = new AttributeRow(name, iconElem);
    customRows[index] = row;
  } else {
    row = customRows[index];
    row.setNameAndIcon(name, iconElem);
  }
  row.setValue(value);
  return row;
};

export default updateCustomAttributeRow;

import nanToZero from '../../dataConversion/nanToZero';
import { ValidNonArrayAttributeType } from '../calculateValue';
import booleanNode from './booleanNode';
import CSS from './CSS';
import numberToNiceString from './numberToNiceString';

const addValue = (
  element: HTMLElement,
  value: ValidNonArrayAttributeType,
  optionalTempValue?: string | number | null,
) => {
  if (!optionalTempValue || value instanceof Node || typeof value === 'boolean') {
    addValueWithoutTemp(element, value);
  } else {
    const tempValue = nanToZero(optionalTempValue);
    if (tempValue === 0) {
      addValueWithoutTemp(element, value);
    } else {
      addValueWithoutTemp(element, nanToZero(value) + tempValue);
      element.classList.add(CSS.TEMP);
    }
  }
};

export default addValue;

const addValueWithoutTemp = (element: HTMLElement, value: ValidNonArrayAttributeType) => {
  element.classList.remove(CSS.TEMP);

  let node: Node;
  if (typeof value === 'boolean') {
    node = booleanNode(value);
  } else if (typeof value === 'number') {
    const asString = numberToNiceString(value);
    node = document.createTextNode(asString);
  } else if (value instanceof Node) {
    node = value;
  } else if (!value) {
    node = document.createTextNode('0');
  } else {
    node = document.createTextNode(value);
  }
  element.appendChild(node);
};

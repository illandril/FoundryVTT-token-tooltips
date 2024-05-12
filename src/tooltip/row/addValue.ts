import nanToZero from '../../dataConversion/nanToZero';
import type { ValidNonArrayAttributeType } from '../calculateValue';
import booleanNode from './booleanNode';
import numberToNiceString from './numberToNiceString';
import * as css from './styles';

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
      element.classList.add(css.TEMP);
    }
  }
};

export default addValue;

const addValueWithoutTemp = (element: HTMLElement, value: ValidNonArrayAttributeType) => {
  element.classList.remove(css.TEMP);
  appendValue(element, value);
};

export const appendValue = (element: Node, value: ValidNonArrayAttributeType) => {
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

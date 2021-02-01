import { CSS_PREFIX } from '../module.js';
import { icon, emptyNode, img, div, span, appendText } from './html.js';

const CSS_ROW = `${CSS_PREFIX}row`;
const CSS_LABEL = `${CSS_PREFIX}label`;
const CSS_VALUE = `${CSS_PREFIX}value`;
const CSS_CURRENT = `${CSS_PREFIX}current`;
const CSS_MAX = `${CSS_PREFIX}max`;
const CSS_TEMP = `${CSS_PREFIX}temp`;

export default class AttributeRow {
  constructor(name, iconNameOrElem) {
    this.name = null;
    this.iconName = null;
    const row = div(CSS_ROW);

    const label = span(CSS_LABEL);
    this.label = label;
    this.setNameAndIcon(name, iconNameOrElem);
    row.appendChild(label);

    const valueDisplay = span(CSS_VALUE);
    row.appendChild(valueDisplay);

    const currDisplay = span(CSS_CURRENT);
    valueDisplay.appendChild(currDisplay);

    this.valueDisplay = valueDisplay;
    this.currDisplay = currDisplay;

    this.element = row;
  }

  setNameAndIcon(name, iconNameOrElem) {
    if (this.name === name && this.iconName === iconNameOrElem) {
      return;
    }
    console.log(`sNAI ${name} ${iconNameOrElem}`);
    this.name = name;
    let iconElem;
    if (typeof iconNameOrElem === 'string') {
      this.iconName = iconNameOrElem;
      iconElem = icon(iconNameOrElem);
    } else {
      this.iconName = null;
      iconElem = iconNameOrElem;
    }
    emptyNode(this.label);
    if (iconElem) {
      this.label.appendChild(iconElem);
      this.label.title = name;
    } else {
      appendText(this.label, name);
    }
  }

  setValue(value, max = null, temp = null, tempMax = null) {
    emptyNode(this.currDisplay);
    addValueWithTemp(this.currDisplay, value, temp);
    if (max) {
      if (this.maxDisplay) {
        emptyNode(this.maxDisplay);
      } else {
        this.maxDisplay = span(CSS_MAX);
        this.valueDisplay.appendChild(this.maxDisplay);
      }
      addValueWithTemp(this.maxDisplay, max, tempMax);
    } else {
      if (this.maxDisplay) {
        this.valueDisplay.removeChild(this.maxDisplay);
        this.maxDisplay = null;
      }
    }
  }
}

const nanToZero = (value) => {
  if (!value) {
    return 0;
  }
  const valueAsFloat = parseFloat(value);
  if (isNaN(valueAsFloat)) {
    return valueAsFloat;
  }
  return value;
};

const addValueWithTemp = (element, value, opt_tempValue) => {
  if (!opt_tempValue) {
    addWithoutTemp(element, value);
  } else {
    const tempValue = nanToZero(opt_tempValue);
    if (tempValue === 0) {
      addWithoutTemp(element, value);
    } else {
      addWithoutTemp(element, nanToZero(value) + tempValue);
      element.classList.add(CSS_TEMP);
    }
  }
};

const addWithoutTemp = (element, value) => {
  element.classList.remove(CSS_TEMP);
  if (typeof value === 'number') {
    if (value === 0.125) {
      appendText(element, '⅛');
    } else if (value === 0.25) {
      appendText(element, '¼');
    } else if (value === 0.5) {
      appendText(element, '½');
    } else {
      appendText(element, '' + value);
    }
  } else if (!value) {
    appendText(element, '0');
  } else {
    appendText(element, value);
  }
};

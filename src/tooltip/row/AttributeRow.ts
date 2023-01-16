import { emptyNode, div, span, optionalIcon } from '../../ui/html';
import { CalculatedValue } from '../calculateValue';
import addValue from './addValue';
import CSS from './CSS';

export default class AttributeRow {
  #name: string | null;
  #iconName: string | null;
  element: HTMLElement;
  #label: HTMLElement;
  // #valueDisplay: HTMLElement;
  #currDisplay: HTMLElement;
  #maxDisplay: HTMLElement = span(CSS.MAX);
  #unitsDisplay: HTMLElement = span(CSS.UNITS);
  #extraDisplay: HTMLElement = span(CSS.EXTRA);

  constructor(name: string, iconNameOrElem: string | Element | null, group?: string) {
    this.#name = null;
    this.#iconName = null;
    const row = div(CSS.ROW);
    if (group) {
      row.setAttribute('data-group', group);
    }
    row.setAttribute('data-name', name);


    const label = span(CSS.LABEL);
    this.#label = label;
    this.setNameAndIcon(name, iconNameOrElem);
    row.appendChild(label);

    const valueDisplay = span(CSS.VALUE);
    row.appendChild(valueDisplay);

    const currDisplay = span(CSS.CURRENT);
    valueDisplay.appendChild(currDisplay);
    valueDisplay.appendChild(this.#maxDisplay);
    valueDisplay.appendChild(this.#unitsDisplay);
    valueDisplay.appendChild(this.#extraDisplay);

    // this.#valueDisplay = valueDisplay;
    this.#currDisplay = currDisplay;

    this.element = row;
  }

  setNameAndIcon(name: string, iconNameOrElem: string | Element | null) {
    if (this.#name === name && this.#iconName === iconNameOrElem) {
      return;
    }
    this.#name = name;
    let iconElem;
    if (typeof iconNameOrElem === 'string') {
      this.#iconName = iconNameOrElem;
      iconElem = optionalIcon(iconNameOrElem);
    } else {
      this.#iconName = null;
      iconElem = iconNameOrElem;
    }
    emptyNode(this.#label);
    if (iconElem) {
      this.#label.appendChild(iconElem);
      this.#label.title = name;
    } else {
      this.#label.appendChild(document.createTextNode(name));
    }
  }

  setValue({ value, temp, max, tempmax, units, extra }: CalculatedValue) {
    if (value instanceof Image) {
      emptyNode(this.#currDisplay);
      this.#currDisplay.appendChild(value);
      return;
    }
    emptyNode(this.#currDisplay);
    addValue(this.#currDisplay, value, temp);
    emptyNode(this.#maxDisplay);
    if (max) {
      addValue(this.#maxDisplay, max, tempmax);
    }
    emptyNode(this.#unitsDisplay);
    if (units) {
      this.#unitsDisplay.appendChild(document.createTextNode(units));
    }
    emptyNode(this.#extraDisplay);
    if (extra) {
      this.#extraDisplay.appendChild(document.createTextNode(extra));
    }
  }
}



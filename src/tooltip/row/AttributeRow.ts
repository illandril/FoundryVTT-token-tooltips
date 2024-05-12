import div from '../../html/div';
import emptyNode from '../../html/emptyNode';
import { optionalIcon } from '../../html/icon';
import span from '../../html/span';
import type { CalculatedValue } from '../calculateValue';
import addValue from './addValue';
import * as css from './styles';

export default class AttributeRow {
  #name: string | null;
  #iconName: string | null;
  element: HTMLElement;
  #label: HTMLElement;
  // #valueDisplay: HTMLElement;
  #currDisplay: HTMLElement;
  #maxDisplay: HTMLElement = span(css.MAX);
  #unitsDisplay: HTMLElement = span(css.UNITS);
  #extraDisplay: HTMLElement = span(css.EXTRA);

  constructor(name: string, iconNameOrElem: string | Element | null, group?: string) {
    this.#name = null;
    this.#iconName = null;
    const row = div(css.ROW);
    if (group) {
      row.setAttribute('data-group', group);
    }
    row.setAttribute('data-name', name);

    const label = span(css.LABEL);
    this.#label = label;
    this.setNameAndIcon(name, iconNameOrElem);
    row.appendChild(label);

    const valueDisplay = span(css.VALUE);
    row.appendChild(valueDisplay);

    const currDisplay = span(css.CURRENT);
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
    let iconElem: Element | null;
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

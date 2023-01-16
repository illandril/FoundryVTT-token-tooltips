import * as attributeLookups from '../attributeLookups';
import module from '../module';
import CustomOptions from '../settings/CustomOptions';
import * as StandardOptions from '../settings/StandardOptions';
import { emptyNode, div } from '../ui/html';
import calculateValue from './calculateValue';
import updateCustomAttributeRow from './customAttribute/updateCustomAttributeRow';
import isTooltipVisible from './isTooltipVisible';
import AttributeRow from './row/AttributeRow';
import showDataType from './showDataType';
import showStandardRow from './showStandardRow';
import StandardRow from './StandardRow';

const CSS_TOOLTIP = module.cssPrefix.child('tooltip');
const CSS_NAME = module.cssPrefix.child('name');
const CSS_DATA = module.cssPrefix.child('data');
const CSS_SHOW = module.cssPrefix.child('show');


module.settings.register('rowsPerTooltip', Number, 5, {
  hasHint: true,
  range: { min: 1, max: 20, step: 1 },
  onChange: (value) => {
    document.documentElement.style.setProperty(
      '--illandril-token-tooltips--tooltip-rows',
      `${value}`,
    );
  },
  callOnChangeOnInit: true,
});

module.settings.register('tooltipFontSize', Number, 1, {
  hasHint: true,
  range: { min: 0.5, max: 3, step: 0.1 },
  onChange: (value) => {
    document.documentElement.style.setProperty(
      '--illandril-token-tooltips--tooltip-base-size',
      `${value}em`,
    );
  },
  callOnChangeOnInit: true,

});

const ShowOnLeft = module.settings.register('showOnLeft', Boolean, false, { hasHint: true });
const ShowTokenName = module.settings.register('showTokenName', Boolean, true, { hasHint: true });
const ShowOnHighlightHotkey = module.settings.register('showOnHighlightHotkey', Boolean, true, { hasHint: true });
const ShowOnlyWithTooltipHotkey = module.settings.register('showOnlyWithTooltipHotkey', Boolean, false, { hasHint: true });

export default class Tooltip {
  #element = div(CSS_TOOLTIP);
  #nameElement = div(CSS_NAME);
  #dataElement = div(CSS_DATA);
  #standardRows: StandardRow[];
  #customRows: AttributeRow[];
  #lastHoverToken: Token | null = null;

  constructor() {
    this.#element.appendChild(this.#nameElement);
    this.#element.appendChild(this.#dataElement);

    this.#standardRows = [];
    this.#prepareStandardRows();
    this.#customRows = [];

    document.body.appendChild(this.#element);
    window.addEventListener('mousedown', () => {
      this.#element.classList.remove(CSS_SHOW);
    });

    Hooks.on('hoverToken', (token, hovered) => {
      this.#onHover(token, hovered);
      if (hovered) {
        this.#lastHoverToken = token;
      } else if (this.#lastHoverToken === token) {
        this.#lastHoverToken = null;
      }
    });

    // showTooltipHotkey.onToggle(() => {
    //   if (this.lastHoverToken) {
    //     this.onHover(this.lastHoverToken, true);
    //   }
    // });
  }

  #prepareStandardRows() {
    for (const lookup of attributeLookups.hps) {
      this.#standardRows.push(new StandardRow(lookup, StandardOptions.HP, 'HP'));
    }
    for (const lookup of attributeLookups.acs) {
      this.#standardRows.push(new StandardRow(lookup, StandardOptions.AC, 'AC'));
    }
    for (const lookup of attributeLookups.attributesPlus) {
      this.#standardRows.push(new StandardRow(lookup, StandardOptions.AttributePlus, 'Attributes'));
    }
    // for (const lookup of attributeLookups.savingThrows) {
    //   this.#standardRows.push(new StandardRow(lookup, StandardOptions.SavingThrows, 'Saving Throws'));
    // }
    // for (const lookup of attributeLookups.damageResImmVuln) {
    //   this.#standardRows.push(new StandardRow(lookup, StandardOptions.DmgResVuln, 'Damage Resistances/Imm/Vuln'));
    // }
    // for (const lookup of attributeLookups.conditionImmunities) {
    //   this.#standardRows.push(new StandardRow(lookup, StandardOptions.CondImm, 'Condition Immunities'));
    // }
    // for (const lookup of attributeLookups.passives) {
    //   this.#standardRows.push(new StandardRow(lookup, StandardOptions.Passives, 'Passives'));
    // }
    // for (const lookup of attributeLookups.movements) {
    //   this.#standardRows.push(new StandardRow(lookup, StandardOptions.Movement, 'Movements'));
    // }
    // for (const lookup of attributeLookups.distanceFromActiveToken) {
    //   this.#standardRows.push(new StandardRow(lookup, StandardOptions.Ruler, 'Distance from Active Token'));
    // }
    // for (const lookup of attributeLookups.resources) {
    //   this.#standardRows.push(new StandardRow(lookup, StandardOptions.Resources, 'Resources'));
    // }
    // for (const lookup of attributeLookups.spellSlots) {
    //   this.#standardRows.push(new StandardRow(lookup, StandardOptions.Spells, 'Spell Slots'));
    // }
  }

  #onHover(token: Token, hovered: boolean) {
    if (hovered && shouldShowTooltip(token)) {
      this.#updateData(token);
      this.#fixPosition(token);
      this.#show();
    } else {
      this.#hide();
    }
  }

  #fixPosition(token: Token) {
    if (ShowOnLeft.get()) {
      const right = window.innerWidth - Math.ceil(token.worldTransform.tx - 8);
      this.#element.style.right = `${right}px`;
      this.#element.style.left = '';
    } else {
      const tokenWidth = token.bounds.width * (game.canvas.stage?.scale.x ?? 1);
      const left = Math.ceil(token.worldTransform.tx + tokenWidth + 8);
      this.#element.style.left = `${left}px`;
      this.#element.style.right = '';
    }
    const top = Math.floor(token.worldTransform.ty - 8);
    this.#element.style.top = `${top}px`;
  }

  #show() {
    this.#element.classList.add(CSS_SHOW);
    this.#fixWidth();
  }

  #isShown() {
    return this.#element.classList.contains(CSS_SHOW);
  }

  #fixWidth() {
    this.#dataElement.style.width = '';
    const lastRow = this.#dataElement.lastElementChild;
    if (lastRow instanceof HTMLElement) {
      const newWidth = lastRow.offsetLeft + lastRow.offsetWidth;
      this.#dataElement.style.width = `${newWidth}px`;
    }
  }

  #hide() {
    this.#element.classList.remove(CSS_SHOW);
  }

  #updateData(token: Token) {
    this.#clearElements();

    this.#updateName(token);

    const actor = token.actor;
    // if (showNameOnly(actor)) {
    //   return;
    // }
    for (const standardRow of this.#standardRows) {
      standardRow.update(this, actor, token);
    }
    this.#updateTalents(actor);
    this.#updateItems(actor);

    this.#updateCustomRows(actor);
  }

  #clearElements() {
    emptyNode(this.#nameElement);
    emptyNode(this.#dataElement);
  }

  #updateName(token: Token) {
    if (ShowTokenName.get()) {
      this.#nameElement.style.display = '';
      this.#nameElement.appendChild(document.createTextNode(token.name));
    } else {
      this.#nameElement.style.display = 'none';
    }
  }

  #prepareAsyncReference(id: string) {
    const referenceStart = document.createComment(`Async Start: ${id}`);
    const referenceEnd = document.createComment(`Async End: ${id}`);
    this.#dataElement.appendChild(referenceStart);
    this.#dataElement.appendChild(referenceEnd);
    return referenceEnd;
  }

  _updateRow(row: AttributeRow, attribute: unknown, reference?: Node) {
    const value = calculateValue(attribute);
    if (value) {
      row.setValue(value);
      if (reference) {
        this.#dataElement.insertBefore(row.element, reference);
      } else {
        this.#dataElement.appendChild(row.element);
      }
      if (this.#isShown()) {
        this.#fixWidth();
      }
    }
  }

  #updateItems(actor: Actor) {
    if (showStandardRow(actor, StandardOptions.Items)) {
      // const items = attributeLookups.items.get(actor);
      // for (const item of items) {
      //   const attributeRow = new AttributeRow(item.name, item.icon, 'Items');
      //   this._updateRow(attributeRow, item.value);
      // }
    }
  }

  #updateTalents(actor: Actor) {
    if (showStandardRow(actor, StandardOptions.Talents)) {
      // const talents = attributeLookups.talents.get(actor);
      // for (const talent of talents) {
      //   const attributeRow = new AttributeRow(talent.name, talent.icon, 'Talents');
      //   this._updateRow(attributeRow, talent.value);
      // }
    }
  }

  #updateCustomRows(actor: Actor) {
    const customOptions = CustomOptions.get();
    if (!customOptions || customOptions.length === 0) {
      return;
    }
    customOptions.forEach((customOption, i) => {
      if (!showDataType(actor, customOption.permission, customOption.hideFromGM)) {
        return;
      }
      const row = updateCustomAttributeRow(actor, customOption, this.#customRows, i);
      if (row) {
        this.#dataElement.appendChild(row.element);
      }
    });
  }
}

const shouldShowTooltip = (token: Token) => {
  if (!(token && token.actor)) {
    return false;
  }
  // if (
  //   !ShowOnHighlightHotkey.get()
  //   && token.mouseInteractionManager.state !== token.mouseInteractionManager.states.HOVER
  // ) {
  //   return false;
  // }
  // if (ShowOnlyWithTooltipHotkey.get() && !showTooltipHotkey.isPressed()) {
  //   return false;
  // }
  if (game.user?.isGM) {
    return true;
  }
  return isTooltipVisible(token);
};

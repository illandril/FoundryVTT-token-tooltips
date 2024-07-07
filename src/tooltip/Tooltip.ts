import * as attributeLookups from '../attributeLookups';
import showNameOnly from '../attributeLookups/showNameOnly';
import div from '../html/div';
import emptyNode from '../html/emptyNode';
import module from '../module';
import type { LookupDetails } from '../persistentTooltip/lookup';
import type { PersistentTooltipPosition } from '../persistentTooltip/types';
import CustomOptions from '../settings/CustomOptions';
import { showTooltipHotkey } from '../settings/hotkeys';
import * as StandardOptions from '../settings/standard-options';
import StandardRow from './StandardRow';
import calculateValue from './calculateValue';
import updateCustomAttributeRow from './customAttribute/updateCustomAttributeRow';
import { disableDarkMode, enableDarkMode } from './darkMode';
import { getControlledToken } from './getControlledToken';
import isTooltipVisible from './isTooltipVisible';
import AttributeRow from './row/AttributeRow';
import showDataType from './showDataType';
import showStandardRow from './showStandardRow';

const CSS_TOOLTIP = module.cssPrefix.child('tooltip');
const CSS_WRAPPER = module.cssPrefix.child('wrapper');
const CSS_NAME = module.cssPrefix.child('name');
const CSS_DATA = module.cssPrefix.child('data');
const CSS_SHOW = module.cssPrefix.child('show');

module.settings.register('rowsPerTooltip', Number, 5, {
  hasHint: true,
  range: { min: 1, max: 30, step: 1 },
  onChange: (value) => {
    document.documentElement.style.setProperty('--illandril-token-tooltips--tooltip-rows', `${value}`);
  },
  callOnChangeOnInit: true,
});

module.settings.register('tooltipFontSize', Number, 1, {
  hasHint: true,
  range: { min: 0.5, max: 3, step: 0.1 },
  onChange: (value) => {
    document.documentElement.style.setProperty('--illandril-token-tooltips--tooltip-base-size', `${value}em`);
  },
  callOnChangeOnInit: true,
});

module.settings.register('rowsPerPersistent', Number, 5, {
  hasHint: true,
  scope: 'client',
  range: { min: 1, max: 30, step: 1 },
  onChange: (value) => {
    document.documentElement.style.setProperty('--illandril-token-tooltips--persistent-tooltip-rows', `${value}`);
    updateAllPersistentTooltips();
  },
  callOnChangeOnInit: true,
});

module.settings.register('persistentFontSize', Number, 1, {
  hasHint: true,
  scope: 'client',
  range: { min: 0.5, max: 3, step: 0.1 },
  onChange: (value) => {
    document.documentElement.style.setProperty(
      '--illandril-token-tooltips--persistent-tooltip-base-size',
      `${value}em`,
    );
    updateAllPersistentTooltips();
  },
  callOnChangeOnInit: true,
});

module.settings.register('darkMode', Boolean, false, {
  hasHint: true,
  onChange: (value) => {
    value ? enableDarkMode() : disableDarkMode();
    updateAllPersistentTooltips();
  },
  callOnChangeOnInit: true,
});

const ShowOnLeft = module.settings.register('showOnLeft', Boolean, false, { hasHint: true });
const ShowTokenName = module.settings.register('showTokenName', Boolean, true, { hasHint: true });
const ShowOnHighlightHotkey = module.settings.register('showOnHighlightHotkey', Boolean, true, { hasHint: true });
const ShowOnlyWithTooltipHotkey = module.settings.register('showOnlyWithTooltipHotkey', Boolean, false, {
  hasHint: true,
});

export type PersistentTooltipArgs = {
  position: PersistentTooltipPosition;
} & LookupDetails;

const fixedWrappers: Record<
  PersistentTooltipPosition['vertical'],
  Record<PersistentTooltipPosition['horizontal'], HTMLDivElement | null>
> = {
  top: {
    left: null,
    center: null,
    right: null,
  },
  center: {
    left: null,
    center: null,
    right: null,
  },
  bottom: {
    left: null,
    center: null,
    right: null,
  },
};

const getFixedWrapper = ({ vertical, horizontal }: PersistentTooltipPosition) => {
  const existingWrapper = fixedWrappers[vertical][horizontal];
  if (existingWrapper) {
    return existingWrapper;
  }

  const uiMiddle = document.getElementById('ui-middle');
  const uiTop = document.getElementById('ui-top');
  const uiBottom = document.getElementById('ui-bottom');
  const newWrapper = div(CSS_WRAPPER);

  newWrapper.setAttribute('data-horizontal', horizontal);
  newWrapper.setAttribute('data-vertical', vertical);

  const fixSize = () => {
    const activeTool = document.querySelector('.control-tool.active');
    newWrapper.style.left = `${
      Math.ceil(activeTool?.getBoundingClientRect()?.right ?? uiMiddle?.getBoundingClientRect().left ?? 0) + 8
    }px`;
    newWrapper.style.right = `${
      Math.ceil(Math.max(window.innerWidth - (uiMiddle?.getBoundingClientRect().right ?? 0), 0)) + 8
    }px`;
    newWrapper.style.top = `${Math.ceil(uiTop?.getBoundingClientRect().height ?? 0) + 8}px`;
    newWrapper.style.bottom = `${Math.ceil(uiBottom?.getBoundingClientRect().height ?? 0) + 8}px`;
  };

  const observer = new ResizeObserver(fixSize);
  if (uiMiddle) {
    observer.observe(uiMiddle);
  }
  if (uiTop) {
    observer.observe(uiTop);
  }
  if (uiBottom) {
    observer.observe(uiBottom);
  }
  fixSize();

  fixedWrappers[vertical][horizontal] = newWrapper;
  document.body.appendChild(newWrapper);
  return newWrapper;
};

const persistentTooltipUpdaters = new Set<() => void>();
export const updateAllPersistentTooltips = foundry.utils.debounce(() => {
  for (const updater of persistentTooltipUpdaters) {
    updater();
  }
}, 100);
Hooks.on('canvasReady', updateAllPersistentTooltips);
Hooks.on('controlToken', updateAllPersistentTooltips);
Hooks.on('updateToken', updateAllPersistentTooltips);
Hooks.on('refreshToken', updateAllPersistentTooltips);
Hooks.on('updateActor', updateAllPersistentTooltips);
Hooks.on('updateUser', updateAllPersistentTooltips);

export default class Tooltip {
  #token: Token | null = null;
  #element = div(CSS_TOOLTIP);
  #persistentUpdater?: () => void;
  #nameElement = div(CSS_NAME);
  #dataElement = div(CSS_DATA);
  #standardRows: StandardRow[];
  #customRows: AttributeRow[];

  constructor(fixed?: PersistentTooltipArgs) {
    this.#element.appendChild(this.#nameElement);
    this.#element.appendChild(this.#dataElement);

    this.#standardRows = [];
    this.#prepareStandardRows();
    this.#customRows = [];

    if (fixed) {
      this.#initializePersistent(fixed);
    } else {
      this.#initializeDynamic();
    }
  }

  get isPersistent() {
    return !!this.#persistentUpdater;
  }

  #initializeDynamic() {
    document.body.appendChild(this.#element);

    window.addEventListener('mousedown', () => {
      this.#element.classList.remove(CSS_SHOW);
    });

    persistentTooltipUpdaters.add(() => {
      if (this.#token) {
        this.#onHover(this.#token);
      }
    });
    Hooks.on('hoverToken', (token, hovered) => {
      this.#onHover(hovered ? token : game.canvas.tokens?.hover ?? null);
    });
    Hooks.on('highlightObjects', (highlight) => {
      const showOnHighlight = ShowOnHighlightHotkey.get();
      module.logger.debug('highlightObjects', highlight, showOnHighlight);
      if (showOnHighlight) {
        this.#onHover(highlight ? getControlledToken() : null);
      }
    });
    showTooltipHotkey.onToggle(() => {
      if (showTooltipHotkey.isPressed()) {
        this.#onHover(game.canvas.tokens?.hover ?? null);
      } else {
        this.#onHover(null);
      }
    });
  }

  #initializePersistent(persistentSettings: PersistentTooltipArgs) {
    getFixedWrapper(persistentSettings.position).appendChild(this.#element);
    if (persistentSettings.position.rotation === 180) {
      this.#element.style.rotate = '180deg';
    } else if (persistentSettings.position.rotation === 90) {
      this.#element.setAttribute('data-vertical', 'true');
    } else if (persistentSettings.position.rotation === 270) {
      this.#element.setAttribute('data-vertical', 'true');
      this.#element.style.rotate = '180deg';
    }
    this.#persistentUpdater = () => {
      this.#updatePersistent(persistentSettings);
    };
    persistentTooltipUpdaters.add(this.#persistentUpdater);
    this.#updatePersistent(persistentSettings);
  }

  #updatePersistent(fixed: PersistentTooltipArgs) {
    const token = fixed.getCurrentToken();
    this.#token = token;
    if (token && shouldShowTooltip(token)) {
      module.logger.debug('updatePersistent show', token);
      this.#updateData(token);
      this.#show();
    } else {
      module.logger.debug('updatePersistent hide', token);
      this.#hide();
    }
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
    for (const lookup of attributeLookups.savingThrows) {
      this.#standardRows.push(new StandardRow(lookup, StandardOptions.SavingThrows, 'Saving Throws'));
    }
    for (const lookup of attributeLookups.damageResImmVuln) {
      this.#standardRows.push(new StandardRow(lookup, StandardOptions.DmgResVuln, 'Damage Resistances/Imm/Vuln'));
    }
    for (const lookup of attributeLookups.conditionImmunities) {
      this.#standardRows.push(new StandardRow(lookup, StandardOptions.CondImm, 'Condition Immunities'));
    }
    for (const lookup of attributeLookups.passives) {
      this.#standardRows.push(new StandardRow(lookup, StandardOptions.Passives, 'Passives'));
    }
    for (const lookup of attributeLookups.movements) {
      this.#standardRows.push(new StandardRow(lookup, StandardOptions.Movement, 'Movements'));
    }
    for (const lookup of attributeLookups.distanceFromActiveToken) {
      this.#standardRows.push(new StandardRow(lookup, StandardOptions.Ruler, 'Distance from Active Token'));
    }
    for (const lookup of attributeLookups.resources) {
      this.#standardRows.push(new StandardRow(lookup, StandardOptions.Resources, 'Resources'));
    }
    for (const lookup of attributeLookups.spellSlots) {
      this.#standardRows.push(new StandardRow(lookup, StandardOptions.Spells, 'Spell Slots'));
    }
  }

  #onHover(token: Token | null) {
    if (token && shouldShowTooltip(token)) {
      this.#token = token;
      module.logger.debug('onHover show', token);
      this.#updateData(token);
      this.#fixPosition(token);
      this.#show();
    } else {
      this.#token = null;
      module.logger.debug('onHover hide', token);
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
    const lastRow = this.#dataElement.lastElementChild;
    if (lastRow instanceof HTMLElement) {
      if (this.#element.getAttribute('data-vertical')) {
        this.#dataElement.style.height = 'max-content';
        const newHeight = lastRow.offsetTop + lastRow.offsetHeight;
        this.#dataElement.style.height = `${newHeight}px`;
      } else {
        this.#dataElement.style.width = 'max-content';
        const newWidth = lastRow.offsetLeft + lastRow.offsetWidth;
        this.#dataElement.style.width = `${newWidth}px`;
      }
    }
  }

  #hide() {
    this.#element.classList.remove(CSS_SHOW);
  }

  #updateData(token: Token) {
    module.logger.debug('updateData', token);
    this.#clearElements();

    this.#updateName(token);

    const actor = token.actor;
    if (showNameOnly(actor)) {
      return;
    }
    for (const standardRow of this.#standardRows) {
      standardRow.update(this, actor, token);
    }
    this.#updateTalents(actor, token);
    this.#updateItems(actor, token);

    this.#updateCustomRows(actor, token);
  }

  #clearElements() {
    emptyNode(this.#nameElement);
    emptyNode(this.#dataElement);
  }

  #updateName(token: Token) {
    if (ShowTokenName.get()) {
      this.#nameElement.style.display = '';
      this.#nameElement.appendChild(document.createTextNode(token.name || ''));
    } else {
      this.#nameElement.style.display = 'none';
    }
  }

  _prepareAsyncReference(id: string) {
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

  #updateItems(actor: Actor, token: Token) {
    if (showStandardRow(actor, token, StandardOptions.Items, this.isPersistent)) {
      try {
        const items = attributeLookups.items.get(actor);
        if (items) {
          for (const item of items) {
            const attributeRow = new AttributeRow(item.name, item.icon, 'Items');
            this._updateRow(attributeRow, item.value);
          }
        }
      } catch (err) {
        module.logger.error('Error updating items', err, actor);
      }
    }
  }

  #updateTalents(actor: Actor, token: Token) {
    if (showStandardRow(actor, token, StandardOptions.Talents, this.isPersistent)) {
      try {
        const talents = attributeLookups.talents.get(actor);
        for (const talent of talents) {
          const attributeRow = new AttributeRow(talent.name, talent.icon, 'Talents');
          this._updateRow(attributeRow, talent.value);
        }
      } catch (err) {
        module.logger.error('Error updating talents', err, actor);
      }
    }
  }

  #updateCustomRows(actor: Actor, token: Token) {
    const customOptions = CustomOptions.get();
    if (!customOptions || customOptions.length === 0) {
      return;
    }
    customOptions.forEach((customOption, i) => {
      if (customOption?.hideOnPersistent && this.isPersistent) {
        return;
      }
      if (!showDataType(actor, token, customOption.permission, customOption.hideFromGM)) {
        return;
      }
      try {
        const row = updateCustomAttributeRow(actor, customOption, this.#customRows, i);
        if (row) {
          this.#dataElement.appendChild(row.element);
        }
      } catch (err) {
        module.logger.error('Error updating custom row', actor, customOption, err);
      }
    });
  }

  destroy() {
    if (!this.#persistentUpdater) {
      throw new Error('Non-persistent tooltips should not be destroyed');
    }
    this.#element.remove();
    persistentTooltipUpdaters.delete(this.#persistentUpdater);
  }
}

const shouldShowTooltip = (token: Token) => {
  if (!token?.actor) {
    return false;
  }
  if (ShowOnlyWithTooltipHotkey.get() && !showTooltipHotkey.isPressed()) {
    return false;
  }
  if (game.user?.isGM) {
    return true;
  }
  return isTooltipVisible(token);
};

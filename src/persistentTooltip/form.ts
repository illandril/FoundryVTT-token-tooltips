import addEventListenerToAll from '../customOptionsForm/addEventListenerToAll';
import module from '../module';
import './form.scss';
import lookup from './lookup';
import PersistentTooltips from './setting';
import { PersistentTooltipOption, PersistentTooltipPosition } from './types';

const FORM_CSS_PREFIX = module.cssPrefix.childPrefix('menu').childPrefix('persistentTooltips');
const CSS = {
  HELP_TOGGLE_ID: FORM_CSS_PREFIX.child('helpToggle'),
  HELP_TOGGLE_ON: FORM_CSS_PREFIX.child('helpToggle-on'),
  HELP_TOGGLE_OFF: FORM_CSS_PREFIX.child('helpToggle-off'),

  DATA: FORM_CSS_PREFIX.child('data'),

  HEADER: FORM_CSS_PREFIX.child('header'),

  TYPE_CELL: FORM_CSS_PREFIX.child('typeCell'),
  ID_CELL: FORM_CSS_PREFIX.child('idCell'),
  ID_STATE: FORM_CSS_PREFIX.child('idState'),
  POSITION_CELL: FORM_CSS_PREFIX.child('positionCell'),
  ROTATION_CELL: FORM_CSS_PREFIX.child('rotationCell'),
  ACTIONS: FORM_CSS_PREFIX.child('actions'),

  ADD_ROW_ID: FORM_CSS_PREFIX.child('addRow'),
  DELETE: FORM_CSS_PREFIX.child('delete'),
  MOVE_DOWN: FORM_CSS_PREFIX.child('moveDown'),
  MOVE_UP: FORM_CSS_PREFIX.child('moveUp'),
} as const;

const rowTemplate = module.registerTemplate('menu-persistentTooltips-row.html');

type CustomFormData = {
  position?: string | string[]
  id?: string | string[]
  rotation?: string | string[]
  type?: string | string[]
};

const menuLocalize = (key: string) => module.localize(`setting.menu.persistentTooltips.${key}`);

const normalizePosition = (position: string) => {
  const [vertical, horizontal] = position.split('.');
  return {
    vertical: vertical as PersistentTooltipPosition['vertical'],
    horizontal: horizontal as PersistentTooltipPosition['horizontal'],
  };
};

const asArray = (value?: string | string[]) => {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
};

const defaultTooltipSettings = {
  type: 'user',
  id: '',
  position: 'bottom.center',
  rotation: '0',
} as const;

class PersistentTooltipForm extends FormApplication {
  constructor(object?: never, options?: FormApplicationOptions) {
    super(object, options);
  }

  /**
   * Default Options for this FormApplication
   */
  static get defaultOptions(): FormApplicationOptions {
    return {
      ...super.defaultOptions,
      ...persistentTooltipFormOptions,
      classes: ['sheet'],
      // width: 960,
      closeOnSubmit: true,
    };
  }

  getCommonData() {
    return {
      CSS,
      menuLocalize,
      types: {
        actor: game.i18n.localize('DOCUMENT.Actor'),
        user: game.i18n.localize('DOCUMENT.User'),
      },
      positions: Object.fromEntries(
        ['left', 'center', 'right']
          .flatMap((horiz) => [`top.${horiz}`, `center.${horiz}`, `bottom.${horiz}`])
          .map((pos) => [
            pos, menuLocalize(`positions.${pos}`),
          ]),
      ),
      rotations: {
        0: menuLocalize('rotations.0'),
        90: menuLocalize('rotations.90'),
        180: menuLocalize('rotations.180'),
        270: menuLocalize('rotations.270'),
      },
    };
  }

  getData() {
    const persistentTooltips = PersistentTooltips.get().map((option) => ({
      type: option.type,
      id: option.id,
      position: `${option.position.vertical}.${option.position.horizontal}`,
      rotation: `${option.position.rotation ?? 0}`,
    }));
    if (persistentTooltips.length === 0) {
      persistentTooltips.push(defaultTooltipSettings);
    }
    return {
      persistentTooltips,
      ...this.getCommonData(),
    };
  }

  // Foundry defines this as async, so we keep it async for consistency
  // eslint-disable-next-line @typescript-eslint/require-await
  async _updateObject(_event: unknown, formData: CustomFormData) {
    const types = asArray(formData.type);
    const ids = asArray(formData.id);
    const positions = asArray(formData.position);
    const rotations = asArray(formData.rotation);
    const value: PersistentTooltipOption[] = [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i] || '';
      if (!id) {
        continue;
      }
      const position = positions[i] || 'bottom.center';
      const type = types[i] || 'user';
      const rotation = rotations[i] || '0';
      value.push({
        type: type as PersistentTooltipOption['type'],
        id,
        position: {
          rotation: parseInt(rotation, 10) || 0,
          ...normalizePosition(position),
        },
      });
    }
    PersistentTooltips.set(value);
  }

  onUpdateTypeOrId(event: Event) {
    if (!(event.target instanceof HTMLElement)) {
      module.logger.error('onUpdateTypeOrId called with an event that did not target an HTMLElement');
      return;
    }
    const row = getRow(event.target);
    if (!row) {
      module.logger.error('onUpdateTypeOrId called with a target with no associated row');
      return;
    }

    this.refreshTypeState(row);
  }

  refreshTypeState(row: JQuery<Element>) {
    const typeInput = row
      .find<HTMLSelectElement>('select[name="type"]')
      .addBack('select[name="type"]')[0];
    const idInput = row
      .find<HTMLInputElement>('input[name="id"]')
      .addBack('input[name="id"]')[0];
    const idStateElement = row.find<HTMLElement>(`.${CSS.ID_STATE}`)[0];
    if (!typeInput || !idInput || !idStateElement) {
      module.logger.error(
        'refreshTypeState could not find associated elements',
        { row, typeInput, idInput, idStateElement },
      );
      return;
    }

    const lookupResult = lookup({
      type: typeInput.value,
      id: idInput.value,
      silent: true,
    });
    if (lookupResult) {
      idStateElement.setAttribute('data-name', lookupResult.name);
      const token = lookupResult.getCurrentToken();
      if (token) {
        if (token.name && token.name !== lookupResult.name) {
          idStateElement.setAttribute('data-name', `${token.name} (${lookupResult.name})`);
        }
        idStateElement.setAttribute('data-token', 'true');
      } else {
        idStateElement.removeAttribute('data-token');
      }
    } else {
      idStateElement.removeAttribute('data-name');
      idStateElement.removeAttribute('data-token');
    }
  }

  onDelete(event: Event) {
    if (!(event.target instanceof HTMLElement)) {
      module.logger.error('onDelete called with an event that did not target an HTMLElement');
      return;
    }
    const row = getRow(event.target);
    if (!row) {
      module.logger.error('onDelete called with a target with no associated row');
      return;
    }
    // eslint-disable-next-line no-alert
    if (confirm(module.localize('setting.menu.customOptions.deleteConfirm'))) {
      row.remove();
    }
    this._refreshActionCells();
    this.setPosition({ height: 'auto' });
  }

  onMoveUp(event: Event) {
    if (!(event.target instanceof HTMLElement)) {
      module.logger.error('onMoveUp called with an event that did not target an HTMLElement');
      return;
    }
    const row = getRow(event.target);
    if (!row) {
      module.logger.error('onMoveUp called with a target with no associated row');
      return;
    }
    const previousRow = getRow(row.first().prev()[0]);
    if (previousRow) {
      row.insertBefore(previousRow.first());
      this._refreshActionCells();
    }
  }

  onMoveDown(event: Event) {
    if (!(event.target instanceof HTMLElement)) {
      module.logger.error('onMoveDown called with an event that did not target an HTMLElement');
      return;
    }
    const row = getRow(event.target);
    if (!row) {
      module.logger.error('onDelete called with a target with no associated row');
      return;
    }
    const nextRow = getRow(row.last().next()[0]);
    if (nextRow) {
      row.insertAfter(nextRow.last());
      this._refreshActionCells();
    }
  }

  onAdd() {
    void (async () => {
      const newRow = jQuery(
        await rowTemplate.render({
          option: defaultTooltipSettings,
          ...this.getCommonData(),
        }),
      );
      const addRow = this.element[0].querySelector(`#${CSS.ADD_ROW_ID}`);
      if (!addRow) {
        module.logger.error('Could not add a new row, because the add button could not be found');
      } else {
        newRow.insertBefore(jQuery(addRow));
        this._activateRowListeners(newRow);
        this.setPosition({ height: 'auto' });
        newRow.first().select();
      }
    })();
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html);
    const form = html.get(0);
    if (!form) {
      module.logger.error('activateListeners called with empty element');
      return;
    }

    module.logger.debug('Activating CustomOptionsForm listeners');

    const addButton = document.getElementById(CSS.ADD_ROW_ID);
    if (!addButton) {
      module.logger.error(`Could not find #${CSS.ADD_ROW_ID} button when adding listeners`);
    } else {
      addButton.addEventListener('click', this.onAdd.bind(this));
    }

    const helpToggle = form.querySelector(`#${CSS.HELP_TOGGLE_ID}`);
    if (!helpToggle) {
      module.logger.error(`Could not find #${CSS.HELP_TOGGLE_ID} button when adding listeners`);
    } else {
      helpToggle.addEventListener('change', () => {
        this.setPosition({ height: 'auto' });
      });
    }

    this._activateRowListeners(html);
  }

  _activateRowListeners(html: JQuery) {
    addEventListenerToAll(html, 'select[name="type"]', 'input', this.onUpdateTypeOrId.bind(this));
    addEventListenerToAll(html, 'input[name="id"]', 'input', this.onUpdateTypeOrId.bind(this));
    addEventListenerToAll(html, `.${CSS.DELETE}`, 'click', this.onDelete.bind(this));
    addEventListenerToAll(html, `.${CSS.MOVE_DOWN}`, 'click', this.onMoveDown.bind(this));
    addEventListenerToAll(html, `.${CSS.MOVE_UP}`, 'click', this.onMoveUp.bind(this));
    this._refreshActionCells();
    for (const type of html.find('select[name="type"]')) {
      const row = getRow(type);
      if (row) {
        this.refreshTypeState(row);
      }
    }
  }

  _refreshActionCells() {
    const allActions = this.element.find(`.${CSS.ACTIONS}`);
    allActions.removeClass('first');
    allActions.removeClass('last');
    allActions.first().addClass('first');
    allActions.last().addClass('last');
  }
}

const persistentTooltipFormOptions = module.settings.registerMenu('persistentTooltips', {
  icon: 'fas fa-bars',
  type: PersistentTooltipForm,
  restricted: false,
});

const getRow = (providedElement: Element) => {
  let element: Element | null = providedElement;
  while (element && !element.parentElement?.classList.contains(CSS.DATA)) {
    element = element.parentElement;
  }

  while (element && !element.classList.contains(CSS.ACTIONS)) {
    element = element.nextElementSibling;
  }
  if (element && element.classList.contains(CSS.ACTIONS)) {
    const elementsInRow = [];
    do {
      elementsInRow.unshift(element);
      element = element.previousElementSibling;
    } while (element && !(element.classList.contains(CSS.HEADER) || element.classList.contains(CSS.ACTIONS)));
    return jQuery(elementsInRow);
  }
  return null;
};



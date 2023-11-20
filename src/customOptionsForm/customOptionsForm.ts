import { isDebug, toggleDebug } from '../debugDisplay/debugDisplay';
import module from '../module';
import CustomOptions, { CustomOption } from '../settings/CustomOptions';
import { PermissionLevel } from '../settings/SpecialPermissions';
import { updateAllPersistentTooltips } from '../tooltip/Tooltip';
import addEventListenerToAll from './addEventListenerToAll';
import getStandardItems from './getStandardOptions';
import permissionMenus from './permissionMenus';
import CSS from './styles';

const customRowTemplate = module.registerTemplate('menu-customOptions-customRow.html');
module.registerTemplate('menu-customOptions-standardRow.html');

type CustomFormData = {
  name: string | string[]
  icon: string[]
  attributeKey: string[]
  showPlayerToGM: boolean[]
  showOnPersistent: boolean[]
  permission: PermissionLevel[]
};
const menuLocalize = (key: string) => module.localize(`setting.menu.customOptions.${key}`);

class CustomOptionsForm extends FormApplication {
  constructor(object?: never, options?: FormApplicationOptions) {
    super(object, options);
  }

  /**
   * Default Options for this FormApplication
   */
  static get defaultOptions(): FormApplicationOptions {
    return {
      ...super.defaultOptions,
      ...customOptionsFormOptions,
      classes: ['sheet'],
      // width: 960,
      closeOnSubmit: true,
    };
  }

  getData() {
    const customOptions = CustomOptions.get();
    const customOptionsPlusGM = customOptions.map(
      (customOption) => {
        return {
          showPlayerToGM: !customOption.hideFromGM,
          showOnPersistent: !customOption.hideOnPersistent,
          ...customOption,
        };
      },
    );
    return {
      ...permissionMenus,
      standardOptions: getStandardItems(),
      customOptions: customOptionsPlusGM,
      CSS,
      menuLocalize,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async _updateObject(_event: unknown, formData: CustomFormData) {
    const standardItems = getStandardItems();
    const newOptions: CustomOption[] = [];
    if (Array.isArray(formData.name)) {
      for (let i = 0; i < formData.name.length; i++) {
        const hideFromGM = !formData.showPlayerToGM[i];
        const hideOnPersistent = !formData.showOnPersistent[i];
        if (i < standardItems.length) {
          const standardItem = standardItems[i];
          standardItem.permissionSetting.set(formData.permission[i]);
          standardItem.hideFromGMSetting?.set(hideFromGM);
          standardItem.hideFromPersistentSetting?.set(hideOnPersistent);
        } else {
          newOptions.push({
            name: formData.name[i],
            icon: formData.icon[i],
            attributeKey: formData.attributeKey[i],
            permission: formData.permission[i],
            hideFromGM,
            hideOnPersistent,
          });
        }
      }
    }
    CustomOptions.set(newOptions);

    // The settings don't always update immediately,
    // so give it time to propogate before updating
    setTimeout(() => {
      updateAllPersistentTooltips();
    }, 100);
  }

  onUpdateIcon(event: Event) {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
      module.logger.error('onUpdateIcon called with an event that did not target an HTMLInputElement');
      return;
    }
    const iconPreview = input.parentNode?.querySelector('.fas');
    if (!iconPreview) {
      module.logger.error('onUpdateIcon called for element with no associated iconPreview');
      return;
    }
    iconPreview.className = `fas fa-${input.value}`;
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

  onToggleDebug(event: Event) {
    event.preventDefault();
    toggleDebug();
    this._fixDebugToggleCSS();
  }

  onAdd() {
    void (async () => {
      const newRow = jQuery(
        await customRowTemplate.render({
          ...permissionMenus,
          option: {
            name: 'New Value',
            permission: 'NONE',
            showPlayerToGM: true,
            showOnPersistent: true,
          },
          CSS,
          menuLocalize,
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

    const debugToggles = form.querySelectorAll(`.${CSS.DEBUG_TOGGLE}`);
    const onToggleDebug = this.onToggleDebug.bind(this);
    for (const debugToggle of debugToggles) {
      debugToggle.addEventListener('click', onToggleDebug);
    }
    this._activateRowListeners(html);
    this._fixDebugToggleCSS();
  }

  _activateRowListeners(html: JQuery) {
    addEventListenerToAll(html, 'input[name="icon"]', 'input', this.onUpdateIcon.bind(this));
    addEventListenerToAll(html, `.${CSS.DELETE}`, 'click', this.onDelete.bind(this));
    addEventListenerToAll(html, `.${CSS.MOVE_DOWN}`, 'click', this.onMoveDown.bind(this));
    addEventListenerToAll(html, `.${CSS.MOVE_UP}`, 'click', this.onMoveUp.bind(this));
    this._refreshActionCells();
  }

  _refreshActionCells() {
    const allCustomActions = this.element.find(`.${CSS.CUSTOM_OPTIONS_TITLE} ~ .${CSS.ACTIONS}`);
    allCustomActions.removeClass('first');
    allCustomActions.removeClass('last');
    allCustomActions.first().addClass('first');
    allCustomActions.last().addClass('last');
  }

  _fixDebugToggleCSS() {
    const debugToggle = this.element.find(`.${CSS.DEBUG_TOGGLE}`);
    if (isDebug()) {
      debugToggle.addClass(CSS.DEBUG_TOGGLE_ON);
    } else {
      debugToggle.removeClass(CSS.DEBUG_TOGGLE_ON);
    }
  }
}

const customOptionsFormOptions = module.settings.registerMenu('customOptions', {
  icon: 'fas fa-bars',
  type: CustomOptionsForm,
  restricted: true,
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



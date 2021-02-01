import { log, CSS_PREFIX, KEY as MODULE_KEY } from '../module.js';

import Settings from './settings.js';
import { fixChoices } from './choice-setting.js';

const FORM_CSS_PREFIX = `${CSS_PREFIX}customOptionForm-`;
const ROW_TEMPLATE = 'modules/illandril-token-tooltips/templates/customOptionsFormRow.html';
const entityPermission = fixChoices('entityPermission', Object.keys(CONST.ENTITY_PERMISSIONS));

Hooks.on('ready', () => {
  getTemplate(ROW_TEMPLATE);
});

export default class CustomOptionsForm extends FormApplication {
  constructor(object, options = {}) {
    super(object, options);
  }

  /**
   * Default Options for this FormApplication
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: 'illandril-token-tooltips--custom-options-form',
      title: 'illandril-token-tooltips.setting.customOptionsMenu.title',
      template: 'modules/illandril-token-tooltips/templates/customOptionsForm.html',
      classes: ['sheet'],
      width: 750,
      closeOnSubmit: true,
    });
  }

  getData() {
    return { customOptions: Settings.CustomOptions.get(), entityPermission, FORM_CSS_PREFIX };
  }

  async _updateObject(event, formData) {
    console.dir(formData);
    const newOptions = [];
    if (Array.isArray(formData.name)) {
      for (let i = 0; i < formData.name.length; i++) {
        newOptions.push({
          name: formData.name[i],
          icon: formData.icon[i],
          attributeKey: formData.attributeKey[i],
          permission: formData.permission[i],
          hideFromGM: formData.hideFromGM[i],
        });
      }
    } else {
      newOptions.push({
        name: formData.name,
        icon: formData.icon,
        attributeKey: formData.attributeKey,
        permission: formData.permission,
        hideFromGM: formData.hideFromGM,
      });
    }
    Settings.CustomOptions.set(newOptions);
  }

  onUpdateIcon(event) {
    const input = event.target;
    const iconPreview = input.parentNode.querySelector('.fas');
    iconPreview.className = `fas fa-${input.value}`;
  }

  onDelete(event) {
    if (confirm(game.i18n.localize(`${MODULE_KEY}.setting.customOptionsMenu.deleteConfirm`))) {
      getRow(event.target).remove();
    }
    this._refreshActionCells();
    this.setPosition({ height: 'auto' });
  }

  onMoveUp(event) {
    const row = getRow(event.target);
    const previousRow = getRow(row.first().prev()[0]);
    console.error('UP');
    console.dir(row);
    console.dir(previousRow);
    if (previousRow) {
      row.insertBefore(previousRow.first());
      this._refreshActionCells();
    }
  }

  onMoveDown(event) {
    const row = getRow(event.target);
    const nextRow = getRow(row.last().next()[0]);
    console.error('DOWN');
    console.dir(row);
    console.dir(nextRow);
    if (nextRow) {
      row.insertAfter(nextRow.last());
      this._refreshActionCells();
    }
  }

  async onAdd(event) {
    let newRow = $(
      await renderTemplate(ROW_TEMPLATE, {
        option: { name: 'New Value', permission: 'NONE' },
        entityPermission,
        FORM_CSS_PREFIX,
      })
    );
    newRow.insertBefore($(`#${FORM_CSS_PREFIX}addRow`));
    this._activateRowListeners(newRow);
    this.setPosition({ height: 'auto' });
    newRow.first().select();
  }

  activateListeners(html) {
    super.activateListeners(html);
    log.debug('Activating CustomOptionsForm listeners');
    html.find(`#${FORM_CSS_PREFIX}addRow a`).on('click', this.onAdd.bind(this));
    this._activateRowListeners(html);
  }

  _activateRowListeners(html) {
    findAllowSelf(html, 'input[name="icon"]').on('input', this.onUpdateIcon.bind(this));
    findAllowSelf(html, `.${FORM_CSS_PREFIX}delete`).on('click', this.onDelete.bind(this));
    findAllowSelf(html, `.${FORM_CSS_PREFIX}moveDown`).on('click', this.onMoveDown.bind(this));
    findAllowSelf(html, `.${FORM_CSS_PREFIX}moveUp`).on('click', this.onMoveUp.bind(this));
    this._refreshActionCells();
  }

  _refreshActionCells() {
    const allActions = this.element.find(`.${FORM_CSS_PREFIX}actions`);
    allActions.removeClass('first');
    allActions.removeClass('last');
    allActions.first().addClass('first');
    allActions.last().addClass('last');
  }
}

const getRow = (element) => {
  while (element && !element.parentNode.classList.contains(`${FORM_CSS_PREFIX}data`)) {
    element = element.parentNode;
  }

  while (element && !element.classList.contains(`${FORM_CSS_PREFIX}actions`)) {
    element = element.nextElementSibling;
  }
  if (element && element.classList.contains(`${FORM_CSS_PREFIX}actions`)) {
    return $([
      // Name
      element.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling,
      // Icon
      element.previousElementSibling.previousElementSibling.previousElementSibling,
      // Key
      element.previousElementSibling.previousElementSibling,
      // Permission
      element.previousElementSibling,
      // Actions
      element,
    ]);
  }
  return null;
};

const findAllowSelf = (html, selector) => {
  return html.find(selector).addBack(selector);
};

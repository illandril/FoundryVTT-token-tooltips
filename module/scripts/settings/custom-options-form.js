import { log, KEY as MODULE_KEY } from '../module.js';
import { isDebug, toggleDebug } from '../ui/custom-options-debug.js';

import Settings, { HIDE_FROM_EVERYONE_OPTION, SHOW_TO_GMS_ONLY } from './settings.js';
import { fixChoices } from './choice-setting.js';

import { supportedSystems as attrPlusSupportedSystems } from '../attribute-lookups/attributesPlus.js';
import { supportedSystems as condImmSupportedSystems } from '../attribute-lookups/conditionImmunities.js';
import { supportedSystems as damResImmVulnSupportedSystems } from '../attribute-lookups/damageResImmVuln.js';
import { unsupportedSystems as savingThrowsUnsupportedSystems } from '../attribute-lookups/saving-throws.js';

const FORM_CSS_PREFIX = `illandril-token-tooltips--customOptionForm-`;
const DEBUG_TOGGLE_CSS = `${FORM_CSS_PREFIX}toggleDebug`;
const DEBUG_TOGGLE_ON_CSS = `${FORM_CSS_PREFIX}toggleDebug-on`;
const ACTIONS_CSS = `${FORM_CSS_PREFIX}actions`;
const CUSTOM_TITLE_CSS = `${FORM_CSS_PREFIX}customOptionsTitle`;
const HEADER_CSS = `${FORM_CSS_PREFIX}header`;

const ROW_TEMPLATE = 'modules/illandril-token-tooltips/templates/customOptionsFormRow.html';
const STD_ROW_TEMPLATE = 'modules/illandril-token-tooltips/templates/standardOptionsFormRow.html';

const GM_PERMISSION__ALL = 'ALL';
const GM_PERMISSION__NPC_ONLY = 'NPC_ONLY';

let entityPermission;
let gmPermissions;
let standardEntityPermission;

const STANDARD_PERMISSION_LEVELS = ['NONE', 'LIMITED', 'OBSERVER', 'OWNER'];
Hooks.on('ready', () => {
  entityPermission = fixChoices(
    'entityPermission',
    [...STANDARD_PERMISSION_LEVELS, SHOW_TO_GMS_ONLY],
    true /* localize */
  );
  gmPermissions = fixChoices(
    'gmPermission',
    [GM_PERMISSION__ALL, GM_PERMISSION__NPC_ONLY],
    true /* localize */
  );
  standardEntityPermission = fixChoices(
    'entityPermission',
    [...STANDARD_PERMISSION_LEVELS, SHOW_TO_GMS_ONLY, HIDE_FROM_EVERYONE_OPTION],
    true /* localize */
  );
  getTemplate(ROW_TEMPLATE);
  getTemplate(STD_ROW_TEMPLATE);
});


const getStandardItem = (name, icon, permissionSetting, gmSetting) => {
  const helpKey = `illandril-token-tooltips.setting.customOptionsMenu.standard.${name}.help`;
  const help = game.i18n.has(helpKey) ? game.i18n.localize(helpKey) : undefined;
  return {
    name: game.i18n.localize(
      `illandril-token-tooltips.setting.customOptionsMenu.standard.${name}.name`
    ),
    icon,
    attributeKey: game.i18n.localize(
      `illandril-token-tooltips.setting.customOptionsMenu.standard.${name}.key`
    ),
    permissionSetting,
    permission: permissionSetting.get(),
    gmSetting,
    hideFromGM: gmSetting && gmSetting.get(),
    gmPermission: gmSetting && (gmSetting.get() ? GM_PERMISSION__NPC_ONLY : GM_PERMISSION__ALL),
    help,
  };
};

const getStandardItems = () => {
  const standardItems = [
    // HP
    getStandardItem('hp', 'heart', Settings.HPMinimumPermission, Settings.HidePlayerHPFromGM),

    // AC
    getStandardItem('ac', 'user-shield', Settings.ACMinimumPermission, Settings.HidePlayerACFromGM),
  ];

  if (attrPlusSupportedSystems.includes(game.system.id)) {
    // Attributes + Mod + Save
    standardItems.push(
      getStandardItem(
        'attributesPlus',
        game.i18n.localize(
          'illandril-token-tooltips.setting.customOptionsMenu.standard.attributesPlus.icon'
        ),
        Settings.AttributePlusMinimumPermission,
        Settings.HidePlayerAttributePlusFromGM
      )
    );
  }

  if (!savingThrowsUnsupportedSystems.includes(game.system.id)) {
    // Saving Throws
    standardItems.push(
      getStandardItem(
        'savingThrows',
        game.i18n.localize(
          'illandril-token-tooltips.setting.customOptionsMenu.standard.savingThrows.icon'
        ),
        Settings.SavingThrowsMinimumPermission,
        Settings.HidePlayerSavingThrowsFromGM
      )
    );
  }

  if (damResImmVulnSupportedSystems.includes(game.system.id)) {
    // Damage Resistances / Immunities / Vulnerabilities
    standardItems.push(
      getStandardItem(
        'dmgResVuln',
        game.i18n.localize(
          'illandril-token-tooltips.setting.customOptionsMenu.standard.dmgResVuln.icon'
        ),
        Settings.DmgResVulnMinimumPermission,
        Settings.HidePlayerDmgResVulnFromGM
      )
    );
  }

  if (condImmSupportedSystems.includes(game.system.id)) {
    // Condition Immunities
    standardItems.push(
      getStandardItem(
        'condImm',
        game.i18n.localize(
          'illandril-token-tooltips.setting.customOptionsMenu.standard.condImm.icon'
        ),
        Settings.CondImmMinimumPermission,
        Settings.HidePlayerCondImmFromGM
      )
    );
  }

  // Passive Skills
  standardItems.push(
    getStandardItem(
      'passives',
      'eye , search , brain',
      Settings.PassivesMinimumPermission,
      Settings.HidePlayerPassivesFromGM
    )
  );

  // Movement
  standardItems.push(
    getStandardItem(
      'movement',
      'walking',
      Settings.MovementMinimumPermission,
      Settings.HidePlayerMovementFromGM
    )
  );

  // Ruler
  standardItems.push(
    getStandardItem(
      'ruler',
      'ruler',
      Settings.RulerMinimumPermission,
      Settings.HidePlayerRulerFromGM
    )
  );

  // Resources
  standardItems.push(
    getStandardItem(
      'resources',
      'circle',
      Settings.ResourcesMinimumPermission,
      Settings.HidePlayerResourcesFromGM
    )
  );

  // Spell Slots
  standardItems.push(
    getStandardItem(
      'spells',
      'star',
      Settings.SpellsMinimumPermission,
      Settings.HidePlayerSpellsFromGM
    )
  );

  if (game.system.id === 'starwarsffg') {
    // Talents
    standardItems.push(
      getStandardItem(
        'talents',
        game.i18n.localize(
          'illandril-token-tooltips.setting.customOptionsMenu.standard.talents.icon'
        ),
        Settings.TalentsMinimumPermission,
        Settings.HidePlayerTalentsFromGM
      )
    );
  }

  if (game.system.id === 'dnd5e') {
    // Items
    standardItems.push(
      getStandardItem(
        'items',
        game.i18n.localize(
          'illandril-token-tooltips.setting.customOptionsMenu.standard.items.icon'
        ),
        Settings.ItemsMinimumPermission,
        Settings.HidePlayerItemsFromGM
      )
    );
  }
  return standardItems;
};

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
      width: 960,
      closeOnSubmit: true,
    });
  }

  getData() {
    return {
      standardOptions: getStandardItems(),
      standardEntityPermission,
      customOptions: Settings.CustomOptions.get().map(v => {
        return { gmPermission: v.hideFromGM ? GM_PERMISSION__NPC_ONLY : GM_PERMISSION__ALL, ...v };
      }),
      entityPermission,
      gmPermissions,
      FORM_CSS_PREFIX,
    };
  }

  async _updateObject(event, formData) {
    const standardItems = getStandardItems();
    const newOptions = [];
    if (Array.isArray(formData.name)) {
      for (let i = 0; i < formData.name.length; i++) {
        const hideFromGM = formData.gmPermission[i] === GM_PERMISSION__NPC_ONLY;
        if (i < standardItems.length) {
          const standardItem = standardItems[i];
          standardItem.permissionSetting.set(formData.permission[i]);
          standardItem.gmSetting?.set(hideFromGM);
        } else {
          newOptions.push({
            name: formData.name[i],
            icon: formData.icon[i],
            attributeKey: formData.attributeKey[i],
            permission: formData.permission[i],
            hideFromGM: hideFromGM,
          });
        }
      }
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
    if (previousRow) {
      row.insertBefore(previousRow.first());
      this._refreshActionCells();
    }
  }

  onMoveDown(event) {
    const row = getRow(event.target);
    const nextRow = getRow(row.last().next()[0]);
    if (nextRow) {
      row.insertAfter(nextRow.last());
      this._refreshActionCells();
    }
  }

  onToggleDebug(event) {
    event.preventDefault();
    toggleDebug();
    this._fixDebugToggleCSS();
  }

  async onAdd(event) {
    let newRow = $(
      await renderTemplate(ROW_TEMPLATE, {
        option: { name: 'New Value', permission: 'NONE' },
        entityPermission,
        gmPermissions,
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
    html.find(`.${FORM_CSS_PREFIX}toggleDebug`).on('click', this.onToggleDebug.bind(this));
    this._activateRowListeners(html);
    this._fixDebugToggleCSS();
  }

  _activateRowListeners(html) {
    findAllowSelf(html, 'input[name="icon"]').on('input', this.onUpdateIcon.bind(this));
    findAllowSelf(html, `.${FORM_CSS_PREFIX}delete`).on('click', this.onDelete.bind(this));
    findAllowSelf(html, `.${FORM_CSS_PREFIX}moveDown`).on('click', this.onMoveDown.bind(this));
    findAllowSelf(html, `.${FORM_CSS_PREFIX}moveUp`).on('click', this.onMoveUp.bind(this));
    this._refreshActionCells();
  }

  _refreshActionCells() {
    const allCustomActions = this.element.find(`.${CUSTOM_TITLE_CSS} ~ .${ACTIONS_CSS}`);
    allCustomActions.removeClass('first');
    allCustomActions.removeClass('last');
    allCustomActions.first().addClass('first');
    allCustomActions.last().addClass('last');
  }

  _fixDebugToggleCSS() {
    const debugToggle = this.element.find(`.${DEBUG_TOGGLE_CSS}`);
    if (isDebug()) {
      debugToggle.addClass(DEBUG_TOGGLE_ON_CSS);
    } else {
      debugToggle.removeClass(DEBUG_TOGGLE_ON_CSS);
    }
  }
}

const getRow = (element) => {
  while (element && !element.parentNode.classList.contains(`${FORM_CSS_PREFIX}data`)) {
    element = element.parentNode;
  }

  while (element && !element.classList.contains(ACTIONS_CSS)) {
    element = element.nextElementSibling;
  }
  if (element && element.classList.contains(ACTIONS_CSS)) {
    let elementsInRow = [];
    do {
      elementsInRow.unshift(element);
      element = element.previousElementSibling;
    } while(element && !(element.classList.contains(HEADER_CSS) || element.classList.contains(ACTIONS_CSS)));
    return $(elementsInRow);
  }
  return null;
};

const findAllowSelf = (html, selector) => {
  return html.find(selector).addBack(selector);
};

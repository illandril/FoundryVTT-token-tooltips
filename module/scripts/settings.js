import { KEY as MODULE_KEY } from './module.js';
import VISIBILITY_RULES from './visibility-rules.js';

export const SETTINGS_UPDATED = MODULE_KEY + '.SettingsUpdated';

const settingsList = [];

const refresh = () => {
  Hooks.callAll(SETTINGS_UPDATED);
};

class Setting {
  constructor(type, key, defaultValue, options = {}) {
    this.type = type;
    this.key = key;
    this.hasHint = !!options.hasHint;
    this.defaultValue = defaultValue;
    this.choices = options.choices || null;
    this.scope = options.scope || 'world';
    settingsList.push(this);
  }

  register() {
    const name = game.i18n.localize(`${MODULE_KEY}.setting.${this.key}.label`);
    const hint = this.hasHint ? game.i18n.localize(`${MODULE_KEY}.setting.${this.key}.hint`) : null;
    game.settings.register(MODULE_KEY, this.key, {
      name,
      hint,
      scope: this.scope,
      config: true,
      default: this.defaultValue,
      type: this.type,
      choices: this.choices,
      onChange: refresh,
    });
  }

  get() {
    return game.settings.get(MODULE_KEY, this.key);
  }
}

const fixChoices = (key, choices) => {
  if (Array.isArray(choices)) {
    const choiceObject = {};
    choices.forEach((choice) => {
      choiceObject[choice] = `${MODULE_KEY}.setting.${key}.option.${choice}`;
    });
    return choiceObject;
  } else {
    return choices;
  }
};

class ChoiceSetting extends Setting {
  constructor(key, defaultValue, choices, options = {}) {
    super(
      String,
      key,
      defaultValue,
      mergeObject(
        options,
        {
          choices: fixChoices(key, choices),
        },
        {
          inplace: false,
        }
      )
    );
  }
}

class BooleanSetting extends Setting {
  constructor(key, defaultValue, options = {}) {
    super(Boolean, key, defaultValue, options);
  }
}

const entityPermission = fixChoices('entityPermission', Object.keys(CONST.ENTITY_PERMISSIONS));

const visibilityChoice = new ChoiceSetting(
  'visibility',
  VISIBILITY_RULES[0].name,
  VISIBILITY_RULES.map((rule) => rule.name),
  { hasHint: true }
);

const Settings = {
  Visibility: {
    shouldShowTooltip: (token) => {
      const setting = visibilityChoice.get();
      const rule = VISIBILITY_RULES.find((rule) => rule.name === setting) || VISIBILITY_RULES[0];
      return rule.shouldShowTooltip(token);
    },
  },
  ItemsMinimumPermission: new ChoiceSetting('itemsMinimumPermission', 'NONE', entityPermission, { hasHint: true }),
  SpellsMinimumPermission: new ChoiceSetting('spellsMinimumPermission', 'NONE', entityPermission, { hasHint: true }),
  HidePlayerItemsFromGM: new BooleanSetting('hidePlayerItemsFromGM', false, { hasHint: true }),
  HidePlayerSpellsFromGM: new BooleanSetting('hidePlayerSpellsFromGM', false, { hasHint: true }),
  ShowMovement: new BooleanSetting('showMovement', false, { hasHint: true }),
  ShowResources: new BooleanSetting('showResources', false, { hasHint: true }),
};

Object.freeze(Settings);
export default Settings;

Hooks.once('init', () => {
  settingsList.forEach((setting) => {
    setting.register();
  });
});

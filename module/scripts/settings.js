import { log, KEY as MODULE_KEY } from './module.js';
import VISIBILITY_RULES from './visibility-rules.js';

const SETTINGS_VERSION = 1;
const SETTINGS_VERSION_KEY = 'settingsVersion';

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

export const HIDE_FROM_EVERYONE_OPTION = 'HIDE_FROM_EVERYONE';

const entityPermission = fixChoices(
  'entityPermission',
  Object.keys(CONST.ENTITY_PERMISSIONS).concat(HIDE_FROM_EVERYONE_OPTION)
);

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

  ItemsMinimumPermission: new ChoiceSetting('itemsMinimumPermission', 'NONE', entityPermission, {
    hasHint: true,
  }),
  HidePlayerItemsFromGM: new BooleanSetting('hidePlayerItemsFromGM', false, { hasHint: true }),

  SpellsMinimumPermission: new ChoiceSetting('spellsMinimumPermission', 'NONE', entityPermission, {
    hasHint: true,
  }),
  HidePlayerSpellsFromGM: new BooleanSetting('hidePlayerSpellsFromGM', false, { hasHint: true }),

  ResourcesMinimumPermission: new ChoiceSetting(
    'resourcesMinimumPermission',
    'NONE',
    entityPermission,
    { hasHint: true }
  ),
  HidePlayerResourcesFromGM: new BooleanSetting('hidePlayerResourcesFromGM', false, {
    hasHint: true,
  }),

  MovementMinimumPermission: new ChoiceSetting('movementMinimumPermission', 'NONE', entityPermission, {
    hasHint: true,
  }),
};

Object.freeze(Settings);
export default Settings;

Hooks.once('init', () => {
  settingsList.forEach((setting) => {
    setting.register();
  });
  game.settings.register(MODULE_KEY, SETTINGS_VERSION_KEY, {
    scope: 'world',
    config: false,
    type: Number,
    default: 0,
  });

  const previousVersion = game.settings.get(MODULE_KEY, SETTINGS_VERSION_KEY);
  if (previousVersion < SETTINGS_VERSION) {
    if (previousVersion < 1) {
      game.settings.register(MODULE_KEY, 'showResources', {
        scope: 'world',
        config: false,
        type: Boolean,
        default: false,
      });
      if (!game.settings.get(MODULE_KEY, 'showResources')) {
        log.info(`Migrating old showResources setting - hiding resources`);
        game.settings.set(
          MODULE_KEY,
          Settings.ResourcesMinimumPermission.key,
          HIDE_FROM_EVERYONE_OPTION
        );
      }
      game.settings.register(MODULE_KEY, 'showMovement', {
        scope: 'world',
        config: false,
        type: Boolean,
        default: false,
      });
      if (!game.settings.get(MODULE_KEY, 'showMovement')) {
        log.info(`Migrating old showMovement setting - hiding movement`);
        game.settings.set(
          MODULE_KEY,
          Settings.MovementMinimumPermission.key,
          HIDE_FROM_EVERYONE_OPTION
        );
      }
    }
    game.settings.set(MODULE_KEY, SETTINGS_VERSION_KEY, SETTINGS_VERSION);
    log.info(`Settings Initialized - upgraded from v${previousVersion} to v${SETTINGS_VERSION}`);
  } else {
    log.info(`Settings Initialized - already on ${SETTINGS_VERSION}`);
  }
});

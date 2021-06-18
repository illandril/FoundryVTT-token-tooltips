import { log, KEY as MODULE_KEY } from '../module.js';
import Settings, { HIDE_FROM_EVERYONE_OPTION, SHOW_TO_GMS_ONLY } from './settings.js';
import CustomOptionsForm from './custom-options-form.js';

import { getSettingsList } from './setting.js';

const SETTINGS_VERSION = 1;
const SETTINGS_VERSION_KEY = 'settingsVersion';

export { Settings as default, HIDE_FROM_EVERYONE_OPTION, SHOW_TO_GMS_ONLY };
window.ITTCustomOptions = Settings.CustomOptions;

Hooks.once('init', () => {
  game.settings.registerMenu(MODULE_KEY, 'customOptionsMenu', {
    name: `${MODULE_KEY}.setting.customOptionsMenu.name`,
    label: `${MODULE_KEY}.setting.customOptionsMenu.label`,
    hint: `${MODULE_KEY}.setting.customOptionsMenu.hint`,
    icon: 'fas fa-bars',
    type: CustomOptionsForm,
    restricted: true,
  });
  getSettingsList().forEach((setting) => {
    setting.register();
  });
  game.settings.register(MODULE_KEY, SETTINGS_VERSION_KEY, {
    scope: 'world',
    config: false,
    type: Number,
    default: 0,
  });
});

Hooks.once('ready', () => {
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

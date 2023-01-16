import module from './module';
import { HIDE_FROM_EVERYONE_OPTION } from './settings/SpecialPermissions';
import { Movement, Resources } from './settings/StandardOptions';

const SettingsVersion = module.settings.register('settingsVersion', Number, 0, { config: false });

const SETTINGS_VERSION = 1;

Hooks.once('ready', () => {
  const previousVersion = SettingsVersion.get();
  if (previousVersion < SETTINGS_VERSION) {
    if (previousVersion < 1) {
      const showResources = module.settings.register('showResources', Boolean, false, {
        config: false,
      });
      if (!showResources.get()) {
        module.logger.info(`Migrating old showResources setting - hiding resources`);
        Resources.permission.set(HIDE_FROM_EVERYONE_OPTION);
      }

      const showMovement = module.settings.register('showMovement', Boolean, false, {
        config: false,
      });
      if (!showMovement.get()) {
        module.logger.info(`Migrating old showMovement setting - hiding movement`);
        Movement.permission.set(HIDE_FROM_EVERYONE_OPTION);
      }
    }
    SettingsVersion.set(SETTINGS_VERSION);
    module.logger.info(`Settings Initialized - upgraded from v${previousVersion} to v${SETTINGS_VERSION}`);
  } else {
    module.logger.info(`Settings Initialized - already on ${SETTINGS_VERSION}`);
  }
});

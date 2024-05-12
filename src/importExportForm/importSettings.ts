import getStandardItems, { type StandardItem } from '../customOptionsForm/getStandardOptions';
import module from '../module';
import CustomOptions, { type CustomOption } from '../settings/CustomOptions';
import type { StandardPermissionLevel } from '../settings/special-permissions';
import { updateAllPersistentTooltips } from '../tooltip/Tooltip';

export type ImportObject = {
  standard?: StandardOptionImport[];
  custom?: CustomOption[];
};
type StandardOptionImport = {
  key: string;
  permission: StandardPermissionLevel;
  hideFromGM: boolean;
  hideOnPersistent: boolean;
};

const STANDARD_OPTION_KEYS: readonly string[] = ['key', 'permission', 'hideFromGM', 'hideOnPersistent'];
const validateStandardOption = (option: StandardOptionImport, standardItems: StandardItem[]) => {
  const keys = Object.keys(option);
  if (keys.length < 4 || keys.some((key) => !STANDARD_OPTION_KEYS.includes(key))) {
    throw new Error(`Parsed standard option has mismatched keys: ${keys.join(', ')}; ${JSON.stringify(option)}`);
  }

  if (typeof option.permission !== 'string') {
    throw new Error(`Parsed custom option had non-string permission: ${JSON.stringify(option)}`);
  }

  if (typeof option.hideFromGM !== 'boolean') {
    throw new Error(`Parsed custom option had non-boolean hideFromGM: ${JSON.stringify(option)}`);
  }

  if (typeof option.hideOnPersistent !== 'boolean') {
    throw new Error(`Parsed custom option had non-boolean hideOnPersistent: ${JSON.stringify(option)}`);
  }

  const itemSettings = standardItems.find((item) => item.key === option.key);
  if (!itemSettings) {
    throw new Error(`Could not find standard option with key: ${JSON.stringify(option)}`);
  }
};

const validateStandardOptions = (standardOptions: StandardOptionImport[], standardItems: StandardItem[]) => {
  if (!Array.isArray(standardOptions)) {
    throw new Error('standard was not an array');
  }
  for (const option of standardOptions) {
    validateStandardOption(option, standardItems);
  }
};

const CUSTOM_OPTION_KEYS: readonly string[] = [
  'name',
  'icon',
  'attributeKey',
  'permission',
  'hideFromGM',
  'hideOnPersistent',
];

const validateCustomOption = (option: CustomOption) => {
  const keys = Object.keys(option);
  if (keys.length < 5 || keys.some((key) => !CUSTOM_OPTION_KEYS.includes(key))) {
    throw new Error(`Parsed custom option has mismatched keys: ${keys.join(', ')}; ${JSON.stringify(option)}`);
  }

  if (typeof option.name !== 'string') {
    throw new Error(`Parsed custom option had non-string name: ${JSON.stringify(option)}`);
  }

  if (typeof option.icon !== 'string') {
    throw new Error(`Parsed custom option had non-string icon: ${JSON.stringify(option)}`);
  }

  if (typeof option.attributeKey !== 'string') {
    throw new Error(`Parsed custom option had non-string attributeKey: ${JSON.stringify(option)}`);
  }

  if (typeof option.permission !== 'string') {
    throw new Error(`Parsed custom option had non-string permission: ${JSON.stringify(option)}`);
  }

  if (typeof option.hideFromGM !== 'boolean') {
    throw new Error(`Parsed custom option had non-boolean hideFromGM: ${JSON.stringify(option)}`);
  }

  if (option.hideOnPersistent !== undefined && typeof option.hideOnPersistent !== 'boolean') {
    throw new Error(`Parsed custom option had non-boolean hideOnPersistent: ${JSON.stringify(option)}`);
  }
};
const validateCustomOptions = (customOptions: CustomOption[]) => {
  if (!Array.isArray(customOptions)) {
    throw new Error('custom was not an array');
  }
  for (const option of customOptions) {
    validateCustomOption(option);
  }
};

const parse = (importString: string) => {
  const importObject = JSON.parse(importString) as ImportObject;

  module.logger.debug('Import string parsed as valid JSON');

  if (typeof importObject !== 'object') {
    throw new Error('Parsed JSON was not an object');
  }

  module.logger.debug('Import string parsed as valid JSON object');

  const keys = Object.keys(importObject);
  if (keys.length === 0 || keys.some((key) => key !== 'standard' && key !== 'custom')) {
    throw new Error(`Parsed object has mismatched keys: ${keys.join(', ')}`);
  }

  module.logger.debug('Import string parsed with expected keys', importObject);

  return importObject;
};

const importSettings = (importString: string) => {
  module.logger.debug('Importing', importString);

  const importObject = parse(importString);

  module.logger.debug('Import String parsed - starting validation', importObject);

  const standardItems = getStandardItems();
  if (importObject.standard) {
    validateStandardOptions(importObject.standard, standardItems);
  }
  if (importObject.custom) {
    validateCustomOptions(importObject.custom);
  }

  module.logger.info('Import validation passed - applying settings');

  if (importObject.standard) {
    module.logger.info('Updating standard items', importObject.standard);
    for (const standardItem of importObject.standard) {
      const itemSettings = standardItems.find((item) => item.key === standardItem.key);
      if (itemSettings) {
        itemSettings.permissionSetting.set(standardItem.permission);
        itemSettings.hideFromGMSetting.set(standardItem.hideFromGM);
        itemSettings.hideOnPersistentSetting.set(standardItem.hideOnPersistent);
      } else {
        module.logger.error(
          'Matching standard setting could not be found, despite finding one during validation',
          standardItem,
        );
      }
    }
  }
  if (importObject.custom) {
    module.logger.info('Updating custom items');
    CustomOptions.set(importObject.custom);
  }

  module.logger.info('Settings updated');
  // The settings don't always update immediately,
  // so give it time to propogate before updating
  setTimeout(() => {
    updateAllPersistentTooltips();
  }, 100);
};

export default importSettings;

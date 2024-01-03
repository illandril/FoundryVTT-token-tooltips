import { supportedSystems as attrPlusSupportedSystems } from '../attributeLookups/attributesPlus';
import { supportedSystems as condImmSupportedSystems } from '../attributeLookups/conditionImmunities';
import { supportedSystems as damResImmVulnSupportedSystems } from '../attributeLookups/damageResImmVuln';
import { unsupportedSystems as savingThrowsUnsupportedSystems } from '../attributeLookups/savingThrows';
import module from '../module';
import { StandardPermissionLevel } from '../settings/SpecialPermissions';
import * as StandardOptions from '../settings/StandardOptions';

const getStandardItems = () => {
  const items: StandardItem[] = [
    getItem('hp', 'heart', StandardOptions.HP),
    getItem('ac', 'user-shield', StandardOptions.AC),
  ];

  // Attributes plus modifiers
  if (attrPlusSupportedSystems.includes(game.system.id)) {
    items.push(getItem('attributesPlus', LOCALIZED_ICON, StandardOptions.AttributePlus));
  }

  if (!savingThrowsUnsupportedSystems.includes(game.system.id)) {
    items.push(getItem('savingThrows', LOCALIZED_ICON, StandardOptions.SavingThrows));
  }

  // Damage Resistances and Immunities
  if (damResImmVulnSupportedSystems.includes(game.system.id)) {
    items.push(getItem('dmgResVuln', LOCALIZED_ICON, StandardOptions.DmgResVuln));
  }

  // Condition Immunities
  if (condImmSupportedSystems.includes(game.system.id)) {
    items.push(getItem('condImm', LOCALIZED_ICON, StandardOptions.CondImm));
  }

  if (damResImmVulnSupportedSystems.includes(game.system.id) || condImmSupportedSystems.includes(game.system.id)) {
    items.push();
  }

  items.push(getItem('passives', 'eye, search, brain', StandardOptions.Passives));
  items.push(getItem('movement', 'walking', StandardOptions.Movement));
  items.push(getItem('ruler', 'ruler', StandardOptions.Ruler));
  items.push(getItem('resources', 'circle', StandardOptions.Resources));
  items.push(getItem('spells', 'star', StandardOptions.Spells));

  if (game.system.id === 'starwarsffg') {
    items.push(getItem('talents', LOCALIZED_ICON, StandardOptions.Talents));
  }

  if (game.system.id === 'dnd5e') {
    items.push(getItem('items', LOCALIZED_ICON, StandardOptions.Items));
  }

  return items;
};

const LOCALIZED_ICON = Symbol('Localized Icon');

export type StandardItem = {
  key: string
  isHP: boolean
  name: string
  icon: string
  iconPreview: string
  attributeKey: string
  permissionSetting: typeof StandardOptions.HP.permission
  permission: StandardPermissionLevel
  hideFromGMSetting: typeof StandardOptions.HP.hideFromGM
  showPlayerToGM: boolean
  hideOnPersistentSetting: typeof StandardOptions.HP.hideOnPersistent
  showOnPersistent: boolean
  help: string | undefined
};

const getItem = (
  key: string, icon: string | typeof LOCALIZED_ICON,
  option: StandardOptions.StandardOption,
): StandardItem => {
  const keyPrefix = `setting.menu.customOptions.standard.${key}`;
  const helpKey = `${keyPrefix}.help`;
  const help = module.localize(helpKey, undefined, true);
  let iconString: string;
  if (icon === LOCALIZED_ICON) {
    iconString = module.localize(`${keyPrefix}.icon`);
  } else {
    iconString = icon;
  }
  return {
    key,
    isHP: key === 'hp',
    name: module.localize(
      `${keyPrefix}.name`,
    ),
    icon: iconString,
    iconPreview: iconString.replace(/,.+/, ''),
    attributeKey: module.localize(
      `${keyPrefix}.key`,
    ),
    permissionSetting: option.permission,
    permission: option.permission.get(),
    hideFromGMSetting: option.hideFromGM,
    showPlayerToGM: !option.hideFromGM.get(),
    showOnPersistent: !option.hideOnPersistent.get(),
    hideOnPersistentSetting: option.hideOnPersistent,
    help,
  };
};

export default getStandardItems;

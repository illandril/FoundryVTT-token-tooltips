import { supportedSystems as attrPlusSupportedSystems } from '../attributeLookups/attributesPlus';
// import { supportedSystems as condImmSupportedSystems } from '../attributeLookups/conditionImmunities';
// import { supportedSystems as damResImmVulnSupportedSystems } from '../attributeLookups/damageResImmVuln';
import { unsupportedSystems as savingThrowsUnsupportedSystems } from '../attributeLookups/savingThrows';
import module from '../module';
import * as StandardOptions from '../settings/StandardOptions';
import { GM_PERMISSION__NPC_ONLY, GM_PERMISSION__ALL } from './permissionMenus';

// eslint-disable-next-line max-lines-per-function
const getStandardItems = () => {
  const standardItems = [
    // HP
    getStandardItem('hp', 'heart', StandardOptions.HP),

    // AC
    getStandardItem('ac', 'user-shield', StandardOptions.AC),
  ];

  if (attrPlusSupportedSystems.includes(game.system.id)) {
    // Attributes + Mod + Save
    standardItems.push(
      getStandardItem(
        'attributesPlus',
        module.localize('setting.menu.customOptions.standard.attributesPlus.icon'),
        StandardOptions.AttributePlus,
      ),
    );
  }

  if (!savingThrowsUnsupportedSystems.includes(game.system.id)) {
    // Saving Throws
    standardItems.push(
      getStandardItem(
        'savingThrows',
        module.localize('setting.menu.customOptions.standard.savingThrows.icon'),
        StandardOptions.SavingThrows,
      ),
    );
  }

  // if (damResImmVulnSupportedSystems.includes(game.system.id)) {
  //   // Damage Resistances / Immunities / Vulnerabilities
  //   standardItems.push(
  //     getStandardItem(
  //       'dmgResVuln',
  //       module.localize(
  //         'setting.menu.customOptions.standard.dmgResVuln.icon',
  //       ),
  //       StandardOptions.DmgResVulnMinimumPermission,
  //       StandardOptions.HidePlayerDmgResVulnFromGM,
  //     ),
  //   );
  // }

  // if (condImmSupportedSystems.includes(game.system.id)) {
  //   // Condition Immunities
  //   standardItems.push(
  //     getStandardItem(
  //       'condImm',
  //       module.localize(
  //         'setting.menu.customOptions.standard.condImm.icon',
  //       ),
  //       StandardOptions.CondImmMinimumPermission,
  //       StandardOptions.HidePlayerCondImmFromGM,
  //     ),
  //   );
  // }

  // Passive Skills
  standardItems.push(
    getStandardItem('passives', 'eye, search, brain', StandardOptions.Passives),
  );

  // Movement
  standardItems.push(
    getStandardItem('movement', 'walking', StandardOptions.Movement),
  );

  // Ruler
  standardItems.push(
    getStandardItem('ruler', 'ruler', StandardOptions.Ruler),
  );

  // Resources
  standardItems.push(
    getStandardItem('resources', 'circle', StandardOptions.Resources),
  );

  // Spell Slots
  standardItems.push(
    getStandardItem('spells', 'star', StandardOptions.Spells),
  );

  if (game.system.id === 'starwarsffg') {
    // Talents
    const icon = module.localize(
      'setting.menu.customOptions.standard.talents.icon',
    );
    standardItems.push(
      getStandardItem('talents', icon, StandardOptions.Talents),
    );
  }

  if (game.system.id === 'dnd5e') {
    // Items
    const icon = module.localize(
      'setting.menu.customOptions.standard.items.icon',
    );
    standardItems.push(
      getStandardItem('items', icon, StandardOptions.Items),
    );
  }
  return standardItems;
};

const getStandardItem = (
  name: string, icon: string,
  option: StandardOptions.StandardOption,
) => {
  const keyPrefix = `setting.menu.customOptions.standard.${name}`;
  const helpKey = `${keyPrefix}.help`;
  const help = module.localize(helpKey, undefined, true);
  return {
    name: module.localize(
      `${keyPrefix}.name`,
    ),
    icon,
    iconPreview: icon.replace(/,.+/, ''),
    attributeKey: module.localize(
      `${keyPrefix}.key`,
    ),
    permissionSetting: option.permission,
    permission: option.permission.get(),
    gmSetting: option.hideFromGM,
    hideFromGM: option.hideFromGM.get(),
    gmPermission: option.hideFromGM.get() ? GM_PERMISSION__NPC_ONLY : GM_PERMISSION__ALL,
    help,
  };
};

export default getStandardItems;

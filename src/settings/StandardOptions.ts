import module from '../module';
import { HIDE_FROM_EVERYONE_OPTION, StandardPermissionLevel } from './SpecialPermissions';

const titleCase = (key: string) => {
  if (key === 'hp' || key === 'ac') {
    return key.toUpperCase();
  }
  return `${key.substring(0, 1).toUpperCase()}${key.substring(1)}`;
};

export type PermissionSetting = ReturnType<typeof module.settings.register<StandardPermissionLevel>>;
export type HideFromGMSetting = ReturnType<typeof module.settings.register<boolean>>;
export type HideFromPersistentSetting = ReturnType<typeof module.settings.register<boolean>>;

export class StandardOption {
  readonly permission: PermissionSetting;
  readonly hideFromGM: HideFromGMSetting;
  readonly hideFromPersistent: HideFromPersistentSetting;
  constructor(key: string, defaultPermission: StandardPermissionLevel) {
    this.permission = module.settings.register<StandardPermissionLevel>(
      `${key}MinimumPermission`, String, defaultPermission, { config: false },
    );
    this.hideFromGM = module.settings.register<boolean>(
      `hidePlayer${titleCase(key)}FromGM`, Boolean, false, { config: false },
    );
    this.hideFromPersistent = module.settings.register<boolean>(
      `hide${titleCase(key)}FromPersistent`, Boolean, false, { config: false },
    );
  }
}

export const HP = new StandardOption('hp', 'NONE');
export const AC = new StandardOption('ac', 'NONE');
export const AttributePlus = new StandardOption('attributePlus', HIDE_FROM_EVERYONE_OPTION);
export const Passives = new StandardOption('passives', 'NONE');
export const Talents = new StandardOption('talents', 'NONE');
export const Items = new StandardOption('items', 'NONE');
export const Spells = new StandardOption('spells', 'NONE');
export const Resources = new StandardOption('resources', 'NONE');
export const Movement = new StandardOption('movement', 'NONE');
export const Ruler = new StandardOption('ruler', 'NONE');
export const SavingThrows = new StandardOption('savingThrows', HIDE_FROM_EVERYONE_OPTION);
export const DmgResVuln = new StandardOption('dmgResVuln', HIDE_FROM_EVERYONE_OPTION);
export const CondImm = new StandardOption('condImm', HIDE_FROM_EVERYONE_OPTION);

import module from '../module';
import { HIDE_FROM_EVERYONE_OPTION, SHOW_TO_GMS_ONLY } from '../settings/special-permissions';

const fixChoices = (key: string, choices: string[]) => {
  const choiceObject: Record<string, string> = {};
  for (const choice of choices) {
    const choiceKey = `setting.${key}.choice.${choice}`;
    choiceObject[choice] = module.localize(choiceKey);
  }
  return choiceObject;
};

const permissionMenus: {
  entityPermission: Record<string, string>;
  standardEntityPermission: Record<string, string>;
} = {
  entityPermission: {},
  standardEntityPermission: {},
};

const STANDARD_PERMISSION_LEVELS = ['NONE', 'LIMITED', 'OBSERVER', 'OWNER', 'FRIENDLY', 'NEUTRAL'];
Hooks.on('ready', () => {
  permissionMenus.entityPermission = fixChoices('entityPermission', [...STANDARD_PERMISSION_LEVELS, SHOW_TO_GMS_ONLY]);
  permissionMenus.standardEntityPermission = fixChoices('entityPermission', [
    ...STANDARD_PERMISSION_LEVELS,
    SHOW_TO_GMS_ONLY,
    HIDE_FROM_EVERYONE_OPTION,
  ]);
});

export default permissionMenus;

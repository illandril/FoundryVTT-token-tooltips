import module from '../module';
import {
  SHOW_TO_GMS_ONLY,
  HIDE_FROM_EVERYONE_OPTION,
} from '../settings/SpecialPermissions';

const fixChoices = (key: string, choices: string[]) => {
  const choiceObject: Record<string, string> = {};
  choices.forEach((choice) => {
    const choiceKey = `setting.${key}.choice.${choice}`;
    choiceObject[choice] = module.localize(choiceKey);
  });
  return choiceObject;
};

const permissionMenus: {
  entityPermission: Record<string, string>
  standardEntityPermission: Record<string, string>
} = {
  entityPermission: {},
  standardEntityPermission: {},
};

const STANDARD_PERMISSION_LEVELS = ['NONE', 'LIMITED', 'OBSERVER', 'OWNER', 'FRIENDLY', 'NEUTRAL'];
Hooks.on('ready', () => {
  permissionMenus.entityPermission = fixChoices(
    'entityPermission',
    [...STANDARD_PERMISSION_LEVELS, SHOW_TO_GMS_ONLY],
  );
  permissionMenus.standardEntityPermission = fixChoices(
    'entityPermission',
    [
      ...STANDARD_PERMISSION_LEVELS,
      SHOW_TO_GMS_ONLY,
      HIDE_FROM_EVERYONE_OPTION,
    ],
  );
});

export default permissionMenus;

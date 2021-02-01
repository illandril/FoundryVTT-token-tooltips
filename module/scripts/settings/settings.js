import VISIBILITY_RULES from '../visibility-rules.js';

import ArraySetting from './array-setting.js';
import BooleanSetting from './boolean-setting.js';
import ChoiceSetting, { fixChoices } from './choice-setting.js';

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

  CustomOptions: new ArraySetting('customOptions', [] ),
};

Object.freeze(Settings);
export default Settings;

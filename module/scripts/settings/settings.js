import VISIBILITY_RULES from '../visibility-rules.js';
import SIMPLIFY_HP_RULES from '../simplify-hp-rules.js';

import ArraySetting from './array-setting.js';
import BooleanSetting from './boolean-setting.js';
import ChoiceSetting from './choice-setting.js';
import RangeSetting from './range-setting.js';
import StringSetting from './string-setting.js';

export const HIDE_FROM_EVERYONE_OPTION = 'HIDE_FROM_EVERYONE';
export const SHOW_TO_GMS_ONLY = "SHOW_TO_GMS_ONLY";

const visibilityChoice = new ChoiceSetting(
  'visibility',
  VISIBILITY_RULES[0].name,
  VISIBILITY_RULES.map((rule) => rule.name),
  { hasHint: true }
);

const simplifyHPChoice = new ChoiceSetting(
  'simplifyHP',
  SIMPLIFY_HP_RULES[0].name,
  SIMPLIFY_HP_RULES.map((rule) => rule.name),
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

  RowsPerTooltip: new RangeSetting('rowsPerTooltip', 5, 1, 20, 1, { hasHint: true }),
  TooltipFontSize: new RangeSetting('tooltipFontSize', 1, 0.5, 3, 0.1, { hasHint: true }),

  HPMinimumPermission: new StringSetting('hpMinimumPermission', 'NONE', {
    config: false,
  }),
  HidePlayerHPFromGM: new BooleanSetting('hidePlayerHPFromGM', false, { config: false }),
  SimplifyHP: {
    simplifyHP: (rawValue, token) => {
      const setting = simplifyHPChoice.get();
      const rule = SIMPLIFY_HP_RULES.find((rule) => rule.name === setting) || SIMPLIFY_HP_RULES[0];
      return rule.simplifyHP(rawValue, token);
    },
  },

  ACMinimumPermission: new StringSetting('acMinimumPermission', 'NONE', {
    config: false,
  }),
  HidePlayerACFromGM: new BooleanSetting('hidePlayerACFromGM', false, { config: false }),

  AttributePlusMinimumPermission: new StringSetting('attributePlusMinimumPermission', HIDE_FROM_EVERYONE_OPTION, {
    config: false,
  }),
  HidePlayerAttributePlusFromGM: new BooleanSetting('hidePlayerAttributePlusFromGM', false, { config: false }),

  PassivesMinimumPermission: new StringSetting('passivesMinimumPermission', 'NONE', {
    config: false,
  }),
  HidePlayerPassivesFromGM: new BooleanSetting('hidePlayerPassivesFromGM', false, {
    config: false,
  }),

  TalentsMinimumPermission: new StringSetting('talentsMinimumPermission', 'NONE', {
    config: false,
  }),
  HidePlayerTalentsFromGM: new BooleanSetting('hidePlayerTalentsFromGM', false, { config: false }),

  ItemsMinimumPermission: new StringSetting('itemsMinimumPermission', 'NONE', {
    config: false,
  }),
  HidePlayerItemsFromGM: new BooleanSetting('hidePlayerItemsFromGM', false, { config: false }),

  SpellsMinimumPermission: new StringSetting('spellsMinimumPermission', 'NONE', {
    config: false,
  }),
  HidePlayerSpellsFromGM: new BooleanSetting('hidePlayerSpellsFromGM', false, { config: false }),

  ResourcesMinimumPermission: new StringSetting('resourcesMinimumPermission', 'NONE', {
    config: false,
  }),
  HidePlayerResourcesFromGM: new BooleanSetting('hidePlayerResourcesFromGM', false, {
    config: false,
  }),

  MovementMinimumPermission: new StringSetting('movementMinimumPermission', 'NONE', {
    config: false,
  }),
  HidePlayerMovementFromGM: new BooleanSetting('hidePlayerMovementFromGM', false, {
    config: false,
  }),

  RulerMinimumPermission: new StringSetting('rulerMinimumPermission', 'NONE', {
    config: false,
  }),
  HidePlayerRulerFromGM: new BooleanSetting('hidePlayerRulerFromGM', false, {
    config: false,
  }),

  SavingThrowsMinimumPermission: new StringSetting('savingThrowsMinimumPermission', HIDE_FROM_EVERYONE_OPTION, {
    config: false,
  }),
  HidePlayerSavingThrowsFromGM: new BooleanSetting('hidePlayerSavingThrowsFromGM', false, {
    config: false,
  }),

  DmgResVulnMinimumPermission: new StringSetting('dmgResVulnMinimumPermission', HIDE_FROM_EVERYONE_OPTION, {
    config: false,
  }),
  HidePlayerDmgResVulnFromGM: new BooleanSetting('hidePlayerDmgResVulnFromGM', false, {
    config: false,
  }),

  CondImmMinimumPermission: new StringSetting('condImmMinimumPermission', HIDE_FROM_EVERYONE_OPTION, {
    config: false,
  }),
  HidePlayerCondImmFromGM: new BooleanSetting('hidePlayerCondImmFromGM', false, {
    config: false,
  }),

  CustomOptions: new ArraySetting('customOptions', []),

  ShowOnLeft: new BooleanSetting('showOnLeft', false, {
    hasHint: true,
  }),

  ShowTokenName: new BooleanSetting('showTokenName', true, {
    hasHint: true,
  }),

  ShowOnHighlightHotkey: new BooleanSetting('showOnHighlightHotkey', true, {
    hasHint: true,
  }),

  ShowOnlyWithTooltipHotkey: new BooleanSetting('showOnlyWithTooltipHotkey', false, {
    hasHint: true,
  }),
};

Object.freeze(Settings);
export default Settings;

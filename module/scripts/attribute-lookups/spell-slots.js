import { CSS_PREFIX } from '../module.js';
import { icon, span, appendText } from '../ui/html.js';
import pf2eSpellSlots from './pf2e/spellSlots.js';

const CSS_SPELLSLOT = `${CSS_PREFIX}spellslot`;
const CSS_SPELLSLOT_LEVEL = `${CSS_PREFIX}spellslot-level`;

const isSetSlots = (value) => {
  if (value === null) {
    return false;
  }
  if (isSetSlotsValue(value)) {
    return true;
  }
  if (typeof value === 'object') {
    if (isSetSlotsValue(value.total) || isSetSlotsValue(value.value)) {
      return isNonZeroMax(value.max);
    }
  }
  return false;
};

const isNonZeroMax = (value) => {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === 'number') {
    return !isNaN(value) && value > 0;
  }
  return typeof value === 'string' && value !== '';
};

const isSetSlotsValue = (value) => {
  if (typeof value === 'number') {
    return !isNaN(value);
  }
  if (typeof value === 'string') {
    return value !== '';
  }
  return false;
};

const spellIcon = (label) => {
  const slotIcon = span(CSS_SPELLSLOT);
  slotIcon.appendChild(icon('star'));
  const slotNumberDisp = span(CSS_SPELLSLOT_LEVEL);
  appendText(slotNumberDisp, label);
  slotIcon.appendChild(slotNumberDisp);
  return slotIcon;
};

const spellSlot = (key, displayKey) => {
  const label = () =>
    typeof displayKey === 'number' ? '' + displayKey : game.i18n.localize(displayKey);
  return {
    icon: () => spellIcon(label()),
    label,
    value: (actor) => {
      const slots = getProperty(actor, key);
      if (isSetSlots(slots)) {
        return slots;
      }
      return null;
    },
  };
};

export default [
  // Simple World-Building
  spellSlot('system.power', 'illandril-token-tooltips.powerAbbreviation'),

  // DnD5e
  spellSlot('system.spells.pact', 'illandril-token-tooltips.pactAbbreviation'),
  spellSlot('system.spells.spell0', 'illandril-token-tooltips.cantripAbbreviation'),
  spellSlot('system.spells.spell1', 1),
  spellSlot('system.spells.spell2', 2),
  spellSlot('system.spells.spell3', 3),
  spellSlot('system.spells.spell4', 4),
  spellSlot('system.spells.spell5', 5),
  spellSlot('system.spells.spell6', 6),
  spellSlot('system.spells.spell7', 7),
  spellSlot('system.spells.spell8', 8),
  spellSlot('system.spells.spell9', 9),

  pf2eSpellSlots(spellIcon),
];

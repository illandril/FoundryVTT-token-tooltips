import AttributeLookup, { AsyncAttributeLookup } from '../AttributeLookup';
import pf2eSpellSlots from '../systems/pf2e/spellSlots';
import spellSlot from './spellSlot.js';

export default [
  // Simple World-Building
  spellSlot('system.power', 'illandril-token-tooltips.powerAbbreviation'),

  // DnD5e
  spellSlot('system.spells.pact', 'illandril-token-tooltips.pactAbbreviation'),
  spellSlot('system.spells.spell0', 'illandril-token-tooltips.cantripAbbreviation'),
  ...Array.from({ length: 9 }, (_v, index) => spellSlot(`system.spells.spell${index + 1}`, index + 1)),

  // a5e
  spellSlot('system.spellResources.points', 'illandril-token-tooltips.spellPointsAbbreviation'),
  ...Array.from({ length: 9 }, (_v, index) => spellSlot(`system.spellResources.slots.${index + 1}`, index + 1)),

  pf2eSpellSlots,
] satisfies (AttributeLookup | AsyncAttributeLookup)[];

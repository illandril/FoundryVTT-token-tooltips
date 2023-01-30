import AttributeLookup, { AsyncAttributeLookup } from '../AttributeLookup';
import pf2eSpellSlots from '../systems/pf2e/spellSlots';
import spellSlot from './spellSlot.js';

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

  pf2eSpellSlots,
] satisfies (AttributeLookup | AsyncAttributeLookup)[];

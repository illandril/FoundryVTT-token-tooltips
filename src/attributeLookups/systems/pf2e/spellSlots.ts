import { AsyncAttributeLookup } from '../../AttributeLookup';
import spellSlots5120 from './spellSlots-5.12.0';
import spellSlotsLegacy from './spellSlots-legacy';
import pf2eSystemID from './systemID';

export default new AsyncAttributeLookup(
  'pf2e Spell Slots',
  async (baseActor: Actor) => {
    if (game.system.id !== pf2eSystemID) {
      return [];
    }

    if (foundry.utils.isNewerVersion('5.12.0', game.system.version)) {
      return spellSlotsLegacy(baseActor);
    }
    return spellSlots5120(baseActor);
  },
);

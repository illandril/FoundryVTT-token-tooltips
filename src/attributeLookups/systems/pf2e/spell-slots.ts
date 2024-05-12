import { AsyncAttributeLookup } from '../../AttributeLookup';
import spellSlots5120 from './spell-slots-5-12-0';
import spellSlotsLegacy from './spell-slots-legacy';
import pf2eSystemID from './systemID';

export default new AsyncAttributeLookup('pf2e Spell Slots', (baseActor: Actor) => {
  if (game.system.id !== pf2eSystemID) {
    return Promise.resolve([]);
  }

  if (foundry.utils.isNewerVersion('5.12.0', game.system.version)) {
    return spellSlotsLegacy(baseActor);
  }
  return spellSlots5120(baseActor);
});

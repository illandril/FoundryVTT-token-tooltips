import isDND35Trap from './systems/d35e/isTrap.js';
import isPF1LootNPC from './systems/pf1/isLootNPC.js';

const showNameOnly = (actor: Actor) => {
  return isDND35Trap(actor) || isPF1LootNPC(actor);
};

export default showNameOnly;

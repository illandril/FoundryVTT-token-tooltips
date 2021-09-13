import isDND35Trap from './d35e/isTrap.js';
import isPF1LootNPC from './pf1/isLootNPC.js';

const showNameOnly = (actor) => {
  return isDND35Trap(actor) || isPF1LootNPC(actor);
};

export default showNameOnly;

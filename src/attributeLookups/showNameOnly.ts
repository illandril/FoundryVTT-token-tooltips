import isDND35Trap from './systems/d35e/isTrap';
import isPF1LootNPC from './systems/pf1/isLootNPC';

const showNameOnly = (actor: Actor) => {
  return isDND35Trap(actor) || isPF1LootNPC(actor);
};

export default showNameOnly;

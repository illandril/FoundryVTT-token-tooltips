import isDND35LiteNPC from '../d35e/isLiteNPC';
import isPF1LiteNPC from '../pf1/isLiteNPC';

const isLiteNPC = (actor: Actor) => {
  return isPF1LiteNPC(actor) || isDND35LiteNPC(actor);
};

export default isLiteNPC;

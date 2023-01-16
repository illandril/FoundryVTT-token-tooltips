import systemID from './systemID';

const isLootNPC = (actor: Actor) => {
  if (game.system.id !== systemID) {
    return false;
  }
  return actor.sheet?.options?.classes?.includes('loot') ?? false;
};

export default isLootNPC;

import systemID from './systemID';

const isLiteNPC = (actor: Actor) => {
  if (game.system.id !== systemID) {
    return false;
  }
  return actor.sheet?.options?.classes?.includes('lite') ?? false;
};

export default isLiteNPC;

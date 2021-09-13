import systemID from './systemID.js';

const isLootNPC = (actor) => {
  if (game.system.id !== systemID) {
    return false;
  }
  const sheetClasses = actor.sheet?.options?.classes;
  return sheetClasses && sheetClasses.includes('loot');
};

export default isLootNPC;

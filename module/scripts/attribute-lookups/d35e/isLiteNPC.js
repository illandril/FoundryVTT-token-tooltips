import systemID from './systemID.js';

const isLiteNPC = (actor) => {
  if (game.system.id !== systemID) {
    return false;
  }
  const sheetClasses = actor.sheet?.options?.classes;
  return sheetClasses && sheetClasses.includes('lite');
};

export default isLiteNPC;

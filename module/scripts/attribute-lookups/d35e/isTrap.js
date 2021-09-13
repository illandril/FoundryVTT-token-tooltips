import systemID from './systemID.js';

const isTrap = (actor) => {
  if (game.system.id !== systemID) {
    return false;
  }
  return actor.type === 'trap';
};

export default isTrap;

import systemID from './systemID';

const isTrap = (actor: Actor) => {
  if (game.system.id !== systemID) {
    return false;
  }
  return actor.type === 'trap';
};

export default isTrap;

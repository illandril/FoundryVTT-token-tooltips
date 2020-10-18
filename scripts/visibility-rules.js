// hasPlayerOwner: 0.7.4, isPC: 0.6.x
export const hasPlayerOwner = Entity.prototype.hasOwnProperty('hasPlayerOwner')
  ? (actor) => actor.hasPlayerOwner
  : (actor) => actor.isPC;

export default [
  {
    name: 'FRIENDLY',
    shouldShowTooltip: (token) => {
      return token.data.disposition >= TOKEN_DISPOSITIONS.FRIENDLY;
    },
  },
  {
    name: 'NEUTRAL',
    shouldShowTooltip: (token) => {
      return token.data.disposition >= TOKEN_DISPOSITIONS.NEUTRAL;
    },
  },
  {
    name: 'ALL_PLAYERS',
    shouldShowTooltip: (token) => {
      return hasPlayerOwner(token.actor);
    },
  },
  {
    name: 'OWNER',
    shouldShowTooltip: (token) => {
      return token.owner;
    },
  },
  {
    name: 'OBSERVER',
    shouldShowTooltip: (token) => {
      return token.observer;
    },
  },
];

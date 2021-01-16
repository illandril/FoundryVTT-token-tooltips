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
      return token.actor.hasPlayerOwner;
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

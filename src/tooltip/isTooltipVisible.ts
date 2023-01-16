import module from '../module';

type VisibilityOption = 'FRIENDLY' | 'NEUTRAL' | 'ALL_PLAYERS' | 'OWNER' | 'OBSERVER' | 'LIMITED' | 'ALL' | 'NONE';
const VisibilityChoice = module.settings.register<VisibilityOption>(
  'visibility', String, 'FRIENDLY', {
    hasHint: true,
    choices: [
      'FRIENDLY', 'NEUTRAL', 'ALL_PLAYERS', 'OWNER', 'OBSERVER', 'LIMITED', 'ALL', 'NONE',
    ],
  },
);

type VisibilityCheck = (token: Token) => boolean;
const Rules = {
  FRIENDLY: (token) => {
    return token.document.disposition >= foundry.CONST.TOKEN_DISPOSITIONS.FRIENDLY;
  },
  NEUTRAL: (token) => {
    return token.document.disposition >= foundry.CONST.TOKEN_DISPOSITIONS.NEUTRAL;
  },
  ALL_PLAYERS: (token) => {
    return token.actor.hasPlayerOwner;
  },
  OWNER: (token) => {
    return token.owner;
  },
  OBSERVER: (token) => {
    return token.observer;
  },
  LIMITED: (token) => {
    if (!game.user) {
      return false;
    }
    return token.actor.testUserPermission(game.user, 'LIMITED');
  },
  ALL: () => {
    return true;
  },
  NONE: () => {
    return false;
  },
} satisfies Record<VisibilityOption, VisibilityCheck>;

export default (token: Token): boolean => {
  const check = Rules[VisibilityChoice.get()] ?? Rules.NONE;
  return check(token);
};

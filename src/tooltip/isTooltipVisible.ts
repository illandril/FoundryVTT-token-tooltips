import module from '../module';

type VisibilityOption = 'FRIENDLY' | 'NEUTRAL' | 'ALL_PLAYERS' | 'OWNER' | 'OBSERVER' | 'LIMITED' | 'ALL' | 'NONE';
const VisibilityChoice = module.settings.register<VisibilityOption>('visibility', String, 'FRIENDLY', {
  hasHint: true,
  choices: ['FRIENDLY', 'NEUTRAL', 'ALL_PLAYERS', 'OWNER', 'OBSERVER', 'LIMITED', 'ALL', 'NONE'],
});

type VisibilityCheck = (token: Token) => boolean;
const Rules = {
  // biome-ignore lint/style/useNamingConvention: Legacy
  FRIENDLY: (token) => {
    return token.document.disposition >= foundry.CONST.TOKEN_DISPOSITIONS.FRIENDLY;
  },
  // biome-ignore lint/style/useNamingConvention: Legacy
  NEUTRAL: (token) => {
    return token.document.disposition >= foundry.CONST.TOKEN_DISPOSITIONS.NEUTRAL;
  },
  // biome-ignore lint/style/useNamingConvention: Legacy
  ALL_PLAYERS: (token) => {
    return token.actor.hasPlayerOwner;
  },
  // biome-ignore lint/style/useNamingConvention: Legacy
  OWNER: (token) => {
    return token.document.isOwner;
  },
  // biome-ignore lint/style/useNamingConvention: Legacy
  OBSERVER: (token) => {
    return token.observer;
  },
  // biome-ignore lint/style/useNamingConvention: Legacy
  LIMITED: (token) => {
    if (!game.user) {
      return false;
    }
    return token.actor.testUserPermission(game.user, 'LIMITED');
  },
  // biome-ignore lint/style/useNamingConvention: Legacy
  ALL: () => {
    return true;
  },
  // biome-ignore lint/style/useNamingConvention: Legacy
  NONE: () => {
    return false;
  },
} satisfies Record<VisibilityOption, VisibilityCheck>;

export default (token: Token): boolean => {
  const check = Rules[VisibilityChoice.get()] ?? Rules.NONE;
  return check(token);
};

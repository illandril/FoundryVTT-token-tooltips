import module from '../../module';
import type { CalculatedValue } from '../../tooltip/calculateValue';
import simplifyToHearts from './simplifyToHearts';

type SimplifyHPOption =
  | 'NONE'
  | 'FOUR_HEARTS__PLAYERS_ALL'
  | 'FOUR_HEARTS__PLAYERS_NON_FRIENDLY'
  | 'FOUR_HEARTS__PLAYERS_HOSTILE'
  | 'FOUR_HEARTS__PLAYERS_NON_OBSERVER'
  | 'FIVE_HEARTS__PLAYERS_ALL'
  | 'FIVE_HEARTS__PLAYERS_NON_FRIENDLY'
  | 'FIVE_HEARTS__PLAYERS_HOSTILE'
  | 'FIVE_HEARTS__PLAYERS_NON_OBSERVER';

const SimplifyHPChoice = module.settings.register<SimplifyHPOption>('simplifyHP', String, 'NONE', {
  hasHint: true,
  choices: [
    'NONE',
    'FOUR_HEARTS__PLAYERS_ALL',
    'FOUR_HEARTS__PLAYERS_NON_FRIENDLY',
    'FOUR_HEARTS__PLAYERS_HOSTILE',
    'FOUR_HEARTS__PLAYERS_NON_OBSERVER',
    'FIVE_HEARTS__PLAYERS_ALL',
    'FIVE_HEARTS__PLAYERS_NON_FRIENDLY',
    'FIVE_HEARTS__PLAYERS_HOSTILE',
    'FIVE_HEARTS__PLAYERS_NON_OBSERVER',
  ],
});

type HPSimplifier = (rawValue: CalculatedValue, actor: Actor, token: Token) => CalculatedValue;

const Simplifiers = {
  // biome-ignore lint/style/useNamingConvention: Legacy
  NONE: (rawValue) => rawValue,
  // biome-ignore lint/style/useNamingConvention: Legacy
  FOUR_HEARTS__PLAYERS_ALL: (rawValue) => {
    let value = rawValue;
    if (!game.user?.isGM) {
      value = simplifyToHearts(rawValue, 4);
    }
    return value;
  },
  // biome-ignore lint/style/useNamingConvention: Legacy
  FOUR_HEARTS__PLAYERS_NON_FRIENDLY: (rawValue, _actor, token) => {
    let value = rawValue;
    if (!game.user?.isGM && token.document.disposition < foundry.CONST.TOKEN_DISPOSITIONS.FRIENDLY) {
      value = simplifyToHearts(rawValue, 4);
    }
    return value;
  },
  // biome-ignore lint/style/useNamingConvention: Legacy
  FOUR_HEARTS__PLAYERS_HOSTILE: (rawValue, _actor, token) => {
    let value = rawValue;
    if (!game.user?.isGM && token.document.disposition < foundry.CONST.TOKEN_DISPOSITIONS.NEUTRAL) {
      value = simplifyToHearts(rawValue, 4);
    }
    return value;
  },
  // biome-ignore lint/style/useNamingConvention: Legacy
  FOUR_HEARTS__PLAYERS_NON_OBSERVER: (rawValue, _actor, token) => {
    let value = rawValue;
    if (game.user && !token.actor.testUserPermission(game.user, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER)) {
      value = simplifyToHearts(rawValue, 4);
    }
    return value;
  },

  // biome-ignore lint/style/useNamingConvention: Legacy
  FIVE_HEARTS__PLAYERS_ALL: (rawValue) => {
    let value = rawValue;
    if (!game.user?.isGM) {
      value = simplifyToHearts(rawValue, 5);
    }
    return value;
  },
  // biome-ignore lint/style/useNamingConvention: Legacy
  FIVE_HEARTS__PLAYERS_NON_FRIENDLY: (rawValue, _actor, token) => {
    let value = rawValue;
    if (!game.user?.isGM && token.document.disposition < foundry.CONST.TOKEN_DISPOSITIONS.FRIENDLY) {
      value = simplifyToHearts(rawValue, 5);
    }
    return value;
  },
  // biome-ignore lint/style/useNamingConvention: Legacy
  FIVE_HEARTS__PLAYERS_HOSTILE: (rawValue, _actor, token) => {
    let value = rawValue;
    if (!game.user?.isGM && token.document.disposition < foundry.CONST.TOKEN_DISPOSITIONS.NEUTRAL) {
      value = simplifyToHearts(rawValue, 5);
    }
    return value;
  },
  // biome-ignore lint/style/useNamingConvention: Legacy
  FIVE_HEARTS__PLAYERS_NON_OBSERVER: (rawValue, _actor, token) => {
    let value = rawValue;
    if (game.user && !token.actor.testUserPermission(game.user, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER)) {
      value = simplifyToHearts(rawValue, 5);
    }
    return value;
  },
} satisfies Record<SimplifyHPOption, HPSimplifier>;

export default (rawValue: CalculatedValue | null, actor: Actor, token: Token) => {
  if (!rawValue) {
    return null;
  }
  const simplifier = Simplifiers[SimplifyHPChoice.get()] ?? Simplifiers.NONE;
  return simplifier(rawValue, actor, token);
};

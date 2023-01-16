import module from '../../module';
import { CalculatedValue } from '../../tooltip/calculateValue';
import { icon, span } from '../../ui/html';

type SimplifyHPOption = ('NONE'
| 'FOUR_HEARTS__PLAYERS_ALL' | 'FOUR_HEARTS__PLAYERS_NON_FRIENDLY' | 'FOUR_HEARTS__PLAYERS_HOSTILE' | 'FOUR_HEARTS__PLAYERS_NON_OBSERVER'
| 'FIVE_HEARTS__PLAYERS_ALL' | 'FIVE_HEARTS__PLAYERS_NON_FRIENDLY' | 'FIVE_HEARTS__PLAYERS_HOSTILE' | 'FIVE_HEARTS__PLAYERS_NON_OBSERVER'
);

const SimplifyHPChoice = module.settings.register<SimplifyHPOption>('simplifyHP', String, 'NONE', {
  hasHint: true,
  choices: [
    'NONE',
    'FOUR_HEARTS__PLAYERS_ALL', 'FOUR_HEARTS__PLAYERS_NON_FRIENDLY', 'FOUR_HEARTS__PLAYERS_HOSTILE', 'FOUR_HEARTS__PLAYERS_NON_OBSERVER',
    'FIVE_HEARTS__PLAYERS_ALL', 'FIVE_HEARTS__PLAYERS_NON_FRIENDLY', 'FIVE_HEARTS__PLAYERS_HOSTILE', 'FIVE_HEARTS__PLAYERS_NON_OBSERVER',
  ],
});

const CSS_HP_HEARTS = module.cssPrefix.child('hp-hearts');

type HPSimplifier = (rawValue: CalculatedValue, token: Token) => CalculatedValue;

const Simplifiers = {
  NONE: (rawValue) => rawValue,
  FOUR_HEARTS__PLAYERS_ALL: (rawValue) => {
    let value = rawValue;
    if (!game.user?.isGM) {
      value = simplifyToHearts(rawValue, 4);
    }
    return value;
  },
  FOUR_HEARTS__PLAYERS_NON_FRIENDLY: (rawValue, token) => {
    let value = rawValue;
    if (!game.user?.isGM && token.document.disposition < foundry.CONST.TOKEN_DISPOSITIONS.FRIENDLY) {
      value = simplifyToHearts(rawValue, 4);
    }
    return value;
  },
  FOUR_HEARTS__PLAYERS_HOSTILE: (rawValue, token) => {
    let value = rawValue;
    if (!game.user?.isGM && token.document.disposition < foundry.CONST.TOKEN_DISPOSITIONS.NEUTRAL) {
      value = simplifyToHearts(rawValue, 4);
    }
    return value;
  },
  FOUR_HEARTS__PLAYERS_NON_OBSERVER: (rawValue, token) => {
    let value = rawValue;
    if (game.user && !token.actor.testUserPermission(game.user, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER)) {
      value = simplifyToHearts(rawValue, 4);
    }
    return value;
  },

  FIVE_HEARTS__PLAYERS_ALL: (rawValue) => {
    let value = rawValue;
    if (!game.user?.isGM) {
      value = simplifyToHearts(rawValue, 5);
    }
    return value;
  },
  FIVE_HEARTS__PLAYERS_NON_FRIENDLY: (rawValue, token) => {
    let value = rawValue;
    if (!game.user?.isGM && token.document.disposition < foundry.CONST.TOKEN_DISPOSITIONS.FRIENDLY) {
      value = simplifyToHearts(rawValue, 5);
    }
    return value;
  },
  FIVE_HEARTS__PLAYERS_HOSTILE: (rawValue, token) => {
    let value = rawValue;
    if (!game.user?.isGM && token.document.disposition < foundry.CONST.TOKEN_DISPOSITIONS.NEUTRAL) {
      value = simplifyToHearts(rawValue, 5);
    }
    return value;
  },
  FIVE_HEARTS__PLAYERS_NON_OBSERVER: (rawValue, token) => {
    let value = rawValue;
    if (game.user && !token.actor.testUserPermission(game.user, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER)) {
      value = simplifyToHearts(rawValue, 5);
    }
    return value;
  },
} satisfies Record<SimplifyHPOption, HPSimplifier>;

const simplifyToHearts = (rawValue: CalculatedValue, numHearts: number) => {
  const value = rawValue;
  if (typeof value.value === 'number' && typeof value.max === 'number') {
    const percent = value.value / value.max;

    // 4-Hearts - 0 = 0, 1-24 = 1, 25-49 = 2, 50-74 = 3, 74-100 = 4
    // 5-Hearts - 0 = 0, 1-19 = 1, 20-39 = 2, 40-59 = 3, 60-79 = 4, 80-100 = 5
    // const shownHearts = percent === 0 ? 0 : Math.floor(percent * numHearts) + 1;

    // 4-Hearts - 0 = 0, 1-25 = 1, 26-50 = 2, 51-75 = 3, 76-100 = 4
    // 5-Hearts - 0 = 0, 1-20 = 1, 21-40 = 2, 41-60 = 3, 61-80 = 4, 81-100 = 5
    const shownHearts = Math.ceil(percent * numHearts);
    const node = span(CSS_HP_HEARTS);
    for (let i = 1; i <= numHearts; i++) {
      node.appendChild(icon('heart', i > shownHearts));
    }
    return {
      value: node,
    };
  }
  return value;
};

export default (rawValue: CalculatedValue | null, token: Token) => {
  if (!rawValue) {
    return null;
  }
  const simplifier = Simplifiers[SimplifyHPChoice.get()] ?? Simplifiers.NONE;
  return simplifier(rawValue, token);
};

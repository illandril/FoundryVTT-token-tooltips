import { CSS_PREFIX } from './module.js';
import { icon, span } from "./ui/html.js";

const CSS_HP_HEARTS = `${CSS_PREFIX}hp-hearts`;

const simplifyToHearts = (rawValue, numHearts) => {
  let value = rawValue;
  if(rawValue?.max) {
    const percent = value.value / value.max;

    // 4-Hearts - 0 = 0, 1-24 = 1, 25-49 = 2, 50-74 = 3, 74-100 = 4
    // 5-Hearts - 0 = 0, 1-19 = 1, 20-39 = 2, 40-59 = 3, 60-79 = 4, 80-100 = 5
    // const shownHearts = percent === 0 ? 0 : Math.floor(percent * numHearts) + 1;

    // 4-Hearts - 0 = 0, 1-25 = 1, 26-50 = 2, 51-75 = 3, 76-100 = 4
    // 5-Hearts - 0 = 0, 1-20 = 1, 21-40 = 2, 41-60 = 3, 61-80 = 4, 81-100 = 5
    const shownHearts = Math.ceil(percent * numHearts);
    value = span(CSS_HP_HEARTS);
    for(let i = 1; i <= numHearts; i++ ) {
      value.appendChild(icon('heart', i > shownHearts));
    }
  }
  return value;
};

export default [
  {
    name: 'NONE',
    simplifyHP: (rawValue) => {
      return rawValue;
    },
  },
  {
    name: 'FOUR_HEARTS__PLAYERS_ALL',
    simplifyHP: (rawValue) => {
      let value = rawValue;
      if(!game.user.isGM) {
        value = simplifyToHearts(rawValue, 4);
      }
      return value;
    },
  },
  {
    name: 'FOUR_HEARTS__PLAYERS_NON_FRIENDLY',
    simplifyHP: (rawValue, token) => {
      let value = rawValue;
      if(!game.user.isGM && token.document.disposition < CONST.TOKEN_DISPOSITIONS.FRIENDLY) {
        value = simplifyToHearts(rawValue, 4);
      }
      return value;
    },
  },
  {
    name: 'FOUR_HEARTS__PLAYERS_HOSTILE',
    simplifyHP: (rawValue, token) => {
      let value = rawValue;
      if(!game.user.isGM && token.document.disposition < CONST.TOKEN_DISPOSITIONS.NEUTRAL) {
        value = simplifyToHearts(rawValue, 4);
      }
      return value;
    },
  },
  {
    name: 'FOUR_HEARTS__PLAYERS_NON_OBSERVER',
    simplifyHP: (rawValue, token) => {
      let value = rawValue;
      if(!token.actor.testUserPermission(game.user, CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER)) {
        value = simplifyToHearts(rawValue, 4);
      }
      return value;
    },
  },
  {
    name: 'FIVE_HEARTS__PLAYERS_ALL',
    simplifyHP: (rawValue) => {
      let value = rawValue;
      if(!game.user.isGM) {
        value = simplifyToHearts(rawValue, 5);
      }
      return value;
    },
  },
  {
    name: 'FIVE_HEARTS__PLAYERS_NON_FRIENDLY',
    simplifyHP: (rawValue, token) => {
      let value = rawValue;
      if(!game.user.isGM && token.document.disposition < CONST.TOKEN_DISPOSITIONS.FRIENDLY) {
        value = simplifyToHearts(rawValue, 5);
      }
      return value;
    },
  },
  {
    name: 'FIVE_HEARTS__PLAYERS_HOSTILE',
    simplifyHP: (rawValue, token) => {
      let value = rawValue;
      if(!game.user.isGM && token.document.disposition < CONST.TOKEN_DISPOSITIONS.NEUTRAL) {
        value = simplifyToHearts(rawValue, 5);
      }
      return value;
    },
  },
  {
    name: 'FIVE_HEARTS__PLAYERS_NON_OBSERVER',
    simplifyHP: (rawValue, token) => {
      let value = rawValue;
      if(!token.actor.testUserPermission(game.user, CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER)) {
        value = simplifyToHearts(rawValue, 5);
      }
      return value;
    },
  },
];

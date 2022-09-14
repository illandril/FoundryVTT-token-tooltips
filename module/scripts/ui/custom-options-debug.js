import { log, CSS_PREFIX, KEY as MODULE_KEY } from '../module.js';
import { icon, emptyNode, img, div, span, appendText } from './html.js';

import { updateCustomAttributeRow } from './custom-attribute-display.js';

const CSS_DISPLAY = `${CSS_PREFIX}debugDisplay`;
const CSS_ROW = `${CSS_PREFIX}debugDisplay-row`;
const CSS_KEY = `${CSS_PREFIX}debugDisplay-key`;
const CSS_VALUE = `${CSS_PREFIX}debugDisplay-value`;

const debugRows = [];

let debug = false;
export const toggleDebug = () => {
  log.info(debug ? 'Disabling Debug' : 'Enabling Debug');
  debug = !debug && game.user.isGM;
  if (debug) {
    debugDisplay.style.display = '';
    emptyNode(debugDisplay);
    debugDisplay.appendChild(
      document.createTextNode(game.i18n.localize(`${MODULE_KEY}.debugDisplay.empty`))
    );
  } else {
    debugDisplay.style.display = 'none';
    emptyNode(debugDisplay);
  }
};

export const isDebug = () => {
  return debug;
};

const debugDisplay = document.createElement('div');
debugDisplay.classList.add(CSS_DISPLAY);
debugDisplay.style.display = 'none';
Hooks.once('ready', () => {
  document.body.appendChild(debugDisplay);
});

Hooks.on('hoverToken', (token, hovered) => {
  if (debug && hovered && token && token.actor) {
    emptyNode(debugDisplay);
    addDataRows(token.actor, null, token.actor, new Set());
  }
});

const addDataRows = (actor, keySoFar, data, seen) => {
  if(seen.has(data)) {
    return;
  }
  seen.add(data);
  const keys = Object.keys(data);
  keys.sort();
  for (let key of keys) {
    if (
      key.startsWith('_') ||
      key === 'permission' ||
      key === 'id' ||
      key === 'sort' ||
      key === 'token'
    ) {
      continue;
    }
    let fullKey = keySoFar === null ? key : `${keySoFar}.${key}`;
    const value = data[key];
    if (value === null || Array.isArray(value)) {
      continue;
    }
    const row = updateCustomAttributeRow(
      actor,
      {
        name: fullKey,
        attributeKey: fullKey,
      },
      debugRows,
      0
    );
    if (row) {
      debugDisplay.appendChild(row.element.cloneNode(true));
    }

    if (typeof value === 'object') {
      addDataRows(actor, fullKey, value, seen);
    }
  }
};

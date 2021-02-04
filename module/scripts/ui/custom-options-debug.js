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
  if (debug && hovered && token && token.actor && token.actor.data) {
    emptyNode(debugDisplay);
    addDataRows(token.actor, null, token.actor.data);
  }
});

const addDataRows = (actor, keySoFar, data) => {
  for (let key in data) {
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
      addDataRows(actor, fullKey, value);
    } else {
      //addDataRow(fullKey, value);
    }
  }
};

const addDataRow = (key, value) => {
  if (typeof value === 'string') {
    if (value.length === 0 || value.length > 25) {
      return;
    }
  } else if (!(typeof value === 'number')) {
    return;
  }

  const row = div(CSS_ROW);

  const keyCell = div(CSS_KEY);
  keyCell.appendChild(document.createTextNode(key));
  row.appendChild(keyCell);

  const valueCell = div(CSS_VALUE);
  valueCell.appendChild(document.createTextNode('' + value));
  row.appendChild(valueCell);
  debugDisplay.appendChild(row);
};

import emptyNode from '../html/emptyNode';
import module from '../module';
import updateCustomAttributeRow from '../tooltip/customAttribute/updateCustomAttributeRow';
import AttributeRow from '../tooltip/row/AttributeRow';
import './styles.scss';

const CSS_PREFIX = module.cssPrefix.childPrefix('debugDisplay');
const CSS_DISPLAY = CSS_PREFIX.child('display');

const debugRows: AttributeRow[] = [];

let debug = false;
export const toggleDebug = () => {
  module.logger.info(debug ? 'Disabling Debug' : 'Enabling Debug');
  debug = !debug && (game.user?.isGM ?? false);
  if (debug) {
    debugDisplay.style.display = '';
    emptyNode(debugDisplay);
    debugDisplay.appendChild(
      document.createTextNode(module.localize('debugDisplay.empty')),
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
    module.logger.info('hoverToken actor', token.actor);
    addDataRows(token.actor, null, token.actor as unknown as Record<string, unknown>, new Set());
  }
});

const addDataRows = (actor: Actor, keySoFar: string | null, data: Record<string, unknown>, seen: Set<object>) => {
  if (seen.has(data)) {
    return;
  }
  seen.add(data);
  const keys = Object.keys(data);
  keys.sort();
  for (const key of keys) {
    if (
      key.startsWith('_')
      || key === 'permission'
      || key === 'id'
      || key === 'sort'
      || key === 'token'
    ) {
      continue;
    }
    const fullKey = keySoFar === null ? key : `${keySoFar}.${key}`;
    const value = data[key];
    if (value === null || Array.isArray(value)) {
      continue;
    }
    const row = updateCustomAttributeRow(
      actor,
      {
        name: fullKey,
        attributeKey: fullKey,
        icon: '',
        hideFromGM: false,
        permission: 'NONE',
      },
      debugRows,
      0,
    );
    if (row) {
      debugDisplay.appendChild(row.element.cloneNode(true));
    }

    if (typeof value === 'object') {
      addDataRows(actor, fullKey, value as Record<string, unknown>, seen);
    }
  }
};

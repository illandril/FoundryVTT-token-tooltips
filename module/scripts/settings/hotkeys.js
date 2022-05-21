import { KEY as MODULE_KEY } from '../module.js';

let showTooltipHotkeyPressed = false;
let showTooltipHotkeyCallbacks = [];

Hooks.once('init', () => {
  game.keybindings.register(MODULE_KEY, 'showTooltip', {
    name: `${MODULE_KEY}.hotkey.showTooltip.label`,
    hint: `${MODULE_KEY}.hotkey.showTooltip.hint`,
    editable: [
      {
        key: 'ShiftLeft',
      },
      {
        key: 'ShiftRight',
      },
    ],
    onDown: () => {
      showTooltipHotkeyPressed = true;
      for (let callback of showTooltipHotkeyCallbacks) {
        callback();
      }
    },
    onUp: () => {
      showTooltipHotkeyPressed = false;
      for (let callback of showTooltipHotkeyCallbacks) {
        callback();
      }
    },
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });
});

export const showTooltipHotkey = Object.freeze({
  isPressed: () => showTooltipHotkeyPressed,
  onToggle: (callback) => {
    showTooltipHotkeyCallbacks.push(callback);
  },
});

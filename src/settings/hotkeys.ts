import module from '../module';

let showTooltipHotkeyPressed = false;
const showTooltipHotkeyCallbacks: (() => void)[] = [];

Hooks.once('init', () => {
  game.keybindings.register(module.id, 'showTooltip', {
    name: module.localize('hotkey.showTooltip.label'),
    hint: module.localize('hotkey.showTooltip.hint'),
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
      for (const callback of showTooltipHotkeyCallbacks) {
        callback();
      }
    },
    onUp: () => {
      showTooltipHotkeyPressed = false;
      for (const callback of showTooltipHotkeyCallbacks) {
        callback();
      }
    },
    precedence: foundry.CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });
});

export const showTooltipHotkey = Object.freeze({
  isPressed: () => showTooltipHotkeyPressed,
  onToggle: (callback: () => void) => {
    showTooltipHotkeyCallbacks.push(callback);
  },
});

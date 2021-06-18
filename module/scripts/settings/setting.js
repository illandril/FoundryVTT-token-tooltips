import { KEY as MODULE_KEY } from '../module.js';

const settingsList = [];

export default class Setting {
  constructor(type, key, defaultValue, options = {}) {
    this.type = type;
    this.key = key;
    this.hasHint = !!options.hasHint;
    this.defaultValue = defaultValue;
    this.choices = options.choices || undefined;
    this.range = options.range || undefined;
    this.scope = options.scope || 'world';
    this.config = typeof options.config === 'boolean' ? options.config : true;
    settingsList.push(this);
  }

  register() {
    const name = game.i18n.localize(`${MODULE_KEY}.setting.${this.key}.label`);
    const hint = this.hasHint ? game.i18n.localize(`${MODULE_KEY}.setting.${this.key}.hint`) : null;
    game.settings.register(MODULE_KEY, this.key, {
      name,
      hint,
      scope: this.scope,
      config: this.config,
      default: this.defaultValue,
      type: this.type,
      choices: this.choices,
      range: this.range,
    });
  }

  getKey() {
    return this.key;
  }

  get() {
    return game.settings.get(MODULE_KEY, this.key);
  }

  set(value) {
    game.settings.set(MODULE_KEY, this.key, value);
  }
}

export const getSettingsList = () => {
  return [...settingsList];
};

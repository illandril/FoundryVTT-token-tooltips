import { KEY as MODULE_KEY } from '../module.js';
import Setting from './setting.js';

export default class StringSetting extends Setting {
  constructor(key, defaultValue, options = {}) {
    super(String, key, defaultValue, options);
  }
}

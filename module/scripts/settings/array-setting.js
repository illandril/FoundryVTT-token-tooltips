import Setting from './setting.js';

export default class ObjectSetting extends Setting {
  constructor(key, defaultValue, options = {}) {
    super(
      Object, // Note: Intentionally not array - Foundry puts the array into another array if type is Array
      key,
      defaultValue,
      mergeObject(
        options,
        {
          config: false,
        },
        {
          inplace: false,
        }
      )
    );
  }

  set(value) {
    if (!Array.isArray(value)) {
      throw new Error('Array setting was set to a non-array');
    }
    super.set(value);
  }
}

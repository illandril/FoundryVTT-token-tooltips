import Setting from './setting.js';

export default class RangeSetting extends Setting {
  constructor(key, defaultValue, min, max, step, options = {}) {
    super(
      Number,
      key,
      defaultValue,
      mergeObject(
        options,
        {
          range: {
            min,
            max,
            step,
          },
        },
        { inplace: false }
      )
    );
  }
}

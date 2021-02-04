import { KEY as MODULE_KEY } from '../module.js';
import Setting from './setting.js';

export const fixChoices = (key, choices, opt_localize) => {
  if (Array.isArray(choices)) {
    const choiceObject = {};
    choices.forEach((choice) => {
      const choiceKey = `${MODULE_KEY}.setting.${key}.option.${choice}`;
      choiceObject[choice] = opt_localize ? game.i18n.localize(choiceKey) : choiceKey;
    });
    return choiceObject;
  } else {
    return choices;
  }
};

export default class ChoiceSetting extends Setting {
  constructor(key, defaultValue, choices, options = {}) {
    super(
      String,
      key,
      defaultValue,
      mergeObject(
        options,
        {
          choices: fixChoices(key, choices),
        },
        {
          inplace: false,
        }
      )
    );
  }
}

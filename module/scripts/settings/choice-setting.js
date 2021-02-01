import { KEY as MODULE_KEY } from '../module.js';
import Setting from './setting.js';

export const fixChoices = (key, choices) => {
  if (Array.isArray(choices)) {
    const choiceObject = {};
    choices.forEach((choice) => {
      choiceObject[choice] = `${MODULE_KEY}.setting.${key}.option.${choice}`;
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

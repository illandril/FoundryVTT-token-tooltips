import { CSS_PREFIX } from '../module.js';
import { icon, span, appendText } from '../ui/html.js';

const CSS_RESOURCE = `${CSS_PREFIX}resource`;
const CSS_RESOURCE_NUMBER = `${CSS_PREFIX}resource-number`;

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const resource = (key, displayID) => {
  return {
    icon: () => {
      const slotIcon = span(CSS_RESOURCE);
      slotIcon.appendChild(icon('circle'));
      const slotNumberDisp = span(CSS_RESOURCE_NUMBER);
      appendText(slotNumberDisp, displayID);
      slotIcon.appendChild(slotNumberDisp);
      return slotIcon;
    },
    label: () => {
      switch (game.system.id) {
        case 'dnd5e':
          return game.i18n.localize(`DND5E.Resource${capitalize(key)}`);
      }
      return `[${key.toUpperCase()}]`;
    },
    value: (actor) => {
      const resource = getProperty(actor.system, `resources.${key}`);
      if (resource && (resource.value > 0 || resource.max > 0)) {
        return resource;
      }
      return null;
    },
  };
};

export default [resource('primary', '1'), resource('secondary', '2'), resource('tertiary', '3')];

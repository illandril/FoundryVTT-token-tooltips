import capitalize from '../dataConversion/capitalize';
import unknownObject from '../dataConversion/unknownObject';
import icon from '../html/icon';
import span from '../html/span';
import module from '../module';
import calculateValue from '../tooltip/calculateValue';
import AttributeLookup from './AttributeLookup';

const CSS_RESOURCE = module.cssPrefix.child('resource');
const CSS_RESOURCE_NUMBER = module.cssPrefix.child('resource-number');

const resourceLookup = (key: string, displayID: string) => {
  return new AttributeLookup(
    () => {
      const slotIcon = span(CSS_RESOURCE);
      slotIcon.appendChild(icon('circle'));
      const slotNumberDisp = span(CSS_RESOURCE_NUMBER);
      slotNumberDisp.appendChild(document.createTextNode(displayID));
      slotIcon.appendChild(slotNumberDisp);
      return slotIcon;
    },
    () => {
      if (game.system.id === 'dnd5e') {
        return game.i18n.localize(`DND5E.Resource${capitalize(key)}`);
      }
      return `[${key.toUpperCase()}]`;
    },
    (actor) => {
      const resource = unknownObject(foundry.utils.getProperty(actor.system, `resources.${key}`));
      if (!resource || typeof resource.value !== 'number') {
        return null;
      }
      if (resource.value > 0 || typeof resource.max === 'number' && resource.max > 0) {
        return calculateValue(resource);
      }
      return null;
    },
  );
};

export default [
  resourceLookup('primary', '1'),
  resourceLookup('secondary', '2'),
  resourceLookup('tertiary', '3'),
] satisfies AttributeLookup[];

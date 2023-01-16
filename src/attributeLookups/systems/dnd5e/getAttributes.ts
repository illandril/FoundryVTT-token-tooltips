import nanToZero from '../../../tooltip/row/nanToZero';
import AttributeLookup from '../../AttributeLookup';

type Maybe5eAttribute = undefined | {
  value?: unknown
  mod?: unknown
  save?: unknown
};

const attribute = (key: string, abbr: string) => {
  return new AttributeLookup(
    () => null,
    () => abbr.toUpperCase(),
    (actor) => {
      const prop = foundry.utils.getProperty(actor.system, `abilities.${key}`) as Maybe5eAttribute;
      if (prop) {
        const value = nanToZero(prop.value);
        const modifier = nanToZero(prop.mod);
        const save = nanToZero(prop.save);
        return {
          value: `${value} (${modifier >= 0 ? '+' : ''}${modifier}, ${save >= 0 ? '+' : ''}${save})`,
        };
      }
      return null;
    },
  );
};

export default () => Object.entries(dnd5e.config.abilityAbbreviations)
  .map(([key, value]) => attribute(key, value as string));

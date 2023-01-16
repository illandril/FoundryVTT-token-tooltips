import nanToZero from '../../../tooltip/row/nanToZero';
import AttributeLookup from '../../AttributeLookup';

type MaybeAttribute = undefined | {
  value?: unknown
  mod?: unknown
};

const attribute = (key: string) => {
  return new AttributeLookup(
    () => null,
    () => game.i18n.localize(`PF2E.AbilityId.${key}`),
    (actor) => {
      const prop = foundry.utils.getProperty(actor.system, `abilities.${key}`) as MaybeAttribute;
      if (prop) {
        const value = nanToZero(prop.value);
        const modifier = nanToZero(prop.mod);
        return { value: `${value} (${modifier >= 0 ? '+' : ''}${modifier})` };
      }
      return null;
    },
  );
};

export default () => ['str', 'dex', 'con', 'int', 'wis', 'cha'].map((key) => attribute(key));

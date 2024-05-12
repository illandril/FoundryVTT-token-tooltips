import nanToZero from '../../../dataConversion/nanToZero';
import AttributeLookup from '../../AttributeLookup';

type MaybeAttribute =
  | undefined
  | {
      value?: unknown;
      mod?: unknown;
    };

const attribute = (key: string) => {
  return new AttributeLookup(
    () => null,
    () => game.i18n.localize(`PF2E.AbilityId.${key}`),
    (actor) => {
      const prop = foundry.utils.getProperty(actor.system, `abilities.${key}`) as MaybeAttribute;
      if (prop) {
        const modifier = nanToZero(prop.mod);
        if (foundry.utils.isNewerVersion('5.3.0', game.system.version)) {
          // Prior to 5.3.0, Pathfinder 2e used values with modifiers
          // Starting in 5.3.0, Pathfinder 2e followed the remastered rules,
          // which replaced ability scores with pure modifiers.
          const value = nanToZero(prop.value);
          return { value: `${value} (${modifier >= 0 ? '+' : ''}${modifier})` };
        }
        return { value: `${modifier >= 0 ? '+' : ''}${modifier}` };
      }
      return null;
    },
  );
};

export default () => ['str', 'dex', 'con', 'int', 'wis', 'cha'].map((key) => attribute(key));

import capitalize from '../../../dataConversion/capitalize';
import localizeOrFallback from '../../../dataConversion/localizeOrFallback';
import module from '../../../module';
import calculateValue from '../../../tooltip/calculateValue';
import AttributeLookup from '../../AttributeLookup';
import simplifyDamageType from '../../damageTypes/simplifyDamageType';
import systemID from './systemID';

type Value = { key: string, value: number, immune: boolean };

const parseResistances = (resistances: unknown) => {
  if (!resistances || typeof resistances !== 'object') {
    return [];
  }
  const values: Value[] = [];
  for (const [key, resistance] of Object.entries<unknown>(resistances as Record<string, unknown>)) {
    if (!resistance || typeof resistance !== 'object') {
      continue;
    }
    const { immune, value } = resistance as { immune: unknown, value: unknown };
    values.push({
      key,
      value: typeof value === 'number' ? value : 0,
      immune: typeof immune === 'boolean' ? immune : false,
    });
  }
  return values;
};

const typeToLocaleKey = (key: string) => {
  if (key === 'damage') {
    return 'All';
  }
  if (key === 'physical') {
    return 'physical';
  }
  return capitalize(key);
};
const resistancesAndImmunities = (
  type: 'Immunities' | 'Resistances' | 'Vulnerabilities',
) => {
  return new AttributeLookup(
    () => null,
    () => module.localize(`tooltip.damage${type}.label`),
    (actor) => {
      if (game.system.id !== systemID) {
        return null;
      }
      const parsed = parseResistances(foundry.utils.getProperty(actor.system, 'resistances'));

      const mapped = parsed.filter(({ immune, value }) => {
        if (type === 'Immunities') {
          return immune;
        }
        if (immune || value === 0) {
          return false;
        }
        if (type === 'Resistances') {
          return value > 0;
        }
        return value < 0;
      }).map((value) => {
        const label = localizeOrFallback(`DND4EBETA.Damage${typeToLocaleKey(value.key)}`, value.key);
        const suffix = type === 'Immunities' ? undefined : `(${value.value > 0 ? '+' : ''}${value.value})`;
        return simplifyDamageType({ localized: label, raw: value.key, suffix });
      });
      return calculateValue(mapped);
    },
  );
};

export default resistancesAndImmunities;

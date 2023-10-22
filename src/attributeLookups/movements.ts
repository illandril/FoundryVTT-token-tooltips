import capitalize from '../dataConversion/capitalize';
import AttributeLookup, { SimpleActorAttributeLookup, ValueLookup } from './AttributeLookup';
import a5eMovement from './systems/a5e/movement';
import d35eOrPF1Movement from './systems/d35eOrPF1/movement';
import dnd5eMovement from './systems/dnd5e/movement';
import pf2Movement from './systems/pf2e/movement';

const labelLookup = (key: string) => () => {
  switch (game.system.id) {
    case 'dnd5e':
      return game.i18n.localize(`DND5E.Movement${capitalize(key)}`);
    case 'pf1':
      return game.i18n.localize(`PF1.Speed${capitalize(key)}_Short`);
    case 'pf2e':
      return game.i18n.localize(`PF2E.SpeedTypes${capitalize(key)}`);
    case 'D35E':
      return game.i18n.localize(`D35E.Speed${capitalize(key)}`);
    case 'a5e':
      return game.i18n.localize(`A5E.Movement${capitalize(key)}ingSpeedAbbr`);
    default:
      return `[${key.toUpperCase()}]`;
  }
};

type SystemValueLookup = (key: string) => ValueLookup;

const multiMovement = (key: string, icon: string, systemLookups: SystemValueLookup[]) => {
  const systems = systemLookups.map((type) => {
    return type(key);
  });
  return new AttributeLookup(
    () => icon,
    labelLookup(key),
    (actor, token) => {
      for (const system of systems) {
        const value = system(actor, token);
        if (value) {
          return value;
        }
      }
      return null;
    },
  );
};

const genericMovement = (keys: string[], icon: string) => {
  return new SimpleActorAttributeLookup(
    () => icon,
    () => {
      switch (game.system.id) {
        case 'swade':
          return game.i18n.localize(`SWADE.Pace`);
        case 'gurps4e':
          return game.i18n.localize(`GURPS4E.attributes.bs`);
        default:
          return '[SPEED]';
      }
    },
    keys,
  );
};

export default [
  multiMovement('walk', 'walking', [dnd5eMovement, a5eMovement]),
  multiMovement('land', 'walking', [d35eOrPF1Movement, pf2Movement]),
  genericMovement(
    [
      'system.characteristics.movement',
      'system.characteristics.speed',
      'system.stats.speed',
      'system.bs',
    ],
    'walking',
  ),
  multiMovement('burrow', 'angle-double-down', [dnd5eMovement, d35eOrPF1Movement, pf2Movement, a5eMovement]),
  multiMovement('climb', 'spider', [dnd5eMovement, d35eOrPF1Movement, pf2Movement, a5eMovement]),
  multiMovement('fly', 'feather-alt', [dnd5eMovement, d35eOrPF1Movement, pf2Movement, a5eMovement]),
  multiMovement('swim', 'swimmer', [dnd5eMovement, d35eOrPF1Movement, pf2Movement, a5eMovement]),
] satisfies AttributeLookup[];

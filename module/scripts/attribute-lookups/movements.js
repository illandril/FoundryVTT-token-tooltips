import { calculateValue } from '../ui/attribute-row.js';

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const labelLookup = (key) => () => {
  switch (game.system.id) {
    case 'dnd5e':
      return game.i18n.localize(`DND5E.Movement${capitalize(key)}`);
    case 'pf1':
      return game.i18n.localize(`PF1.Speed${capitalize(key)}_Short`);
    case 'pf2e':
      return game.i18n.localize(`PF2E.SpeedTypes${capitalize(key)}`);
    case 'D35E':
      return game.i18n.localize(`D35E.Speed${capitalize(key)}`);
  }
  return `[${key.toUpperCase()}]`;
};

const dnd5eMovement = (key, icon) => {
  return {
    icon: () => icon,
    label: labelLookup(key),
    value: (actor) => {
      let value = calculateValue(getProperty(actor, `data.data.attributes.movement.${key}`));
      if (value && value.value > 0) {
        const units = getProperty(actor, 'data.data.attributes.movement.units');
        if (units) {
          value.units = units;
        }
        return value;
      }
      return null;
    },
  };
};

const pf1Movement = (key, icon) => {
  return {
    icon: () => icon,
    label: labelLookup(key),
    value: (actor) => {
      const value = calculateValue(getProperty(actor, `data.data.attributes.speed.${key}`));
      if (value && value.value > 0) {
        if(key === 'fly') {
          const maneuverAbility = getProperty(actor, 'data.data.attributes.speed.fly.maneuverability');
          if(maneuverAbility) {
            const maneuverKey = `PF1.FlyManeuverability${capitalize(maneuverAbility)}`;
            let maneuverLabel = maneuverAbility;
            if(game.i18n.has(maneuverKey)) {
              maneuverLabel = game.i18n.localize(maneuverKey);
            }
            value.extra = maneuverLabel;
          }
        }
        return value;
      }
      return null;
    },
  };
};

const pf2Movement = (key, icon) => {
  return {
    icon: () => icon,
    label: labelLookup(key),
    value: (actor) => {
      const speed = getProperty(actor, 'data.data.attributes.speed');
      if (!speed) {
        return null;
      }
      let value;
      if (speed.type === key) {
        value = calculateValue(speed);
      } else {
        value = null;
        if (speed.otherSpeeds) {
          for (let otherSpeed of speed.otherSpeeds) {
            if (otherSpeed.type === key) {
              value = calculateValue(otherSpeed);
              break;
            }
          }
        }
      }
      if (value && value.value > 0) {
        return value;
      }
      return null;
    },
  };
};

const multiMovement = (key, icon, types) => {
  const systems = types.map((type) => {
    return type(key, icon);
  });
  return {
    icon: () => icon,
    label: labelLookup(key),
    value: (actor) => {
      for (let system of systems) {
        const value = system.value(actor);
        if (value) {
          return value;
        }
      }
      return null;
    },
  };
};

const genericMovement = (keys, icon) => {
  return {
    icon: () => icon,
    label: () => {
      switch (game.system.id) {
        case 'swade':
          return game.i18n.localize(`SWADE.Pace`);
          case 'gurps4e':
            return game.i18n.localize(`GURPS4E.attributes.bs`);
      }
      return '[SPEED]';
    },
    value: (actor) => {
      let value;
      for (let key of keys) {
        value = getProperty(actor, key);
        if (value) {
          return value;
        }
      }
      return null;
    },
  };
};

export default [
  dnd5eMovement('walk', 'walking'),
  multiMovement('land', 'walking', [pf1Movement, pf2Movement]),
  genericMovement(
    [
      'data.data.cahracteristics.movement',
      'data.data.cahracteristics.speed',
      'data.data.stats.speed',
      'data.data.bs',
    ],
    'walking'
  ),
  multiMovement('burrow', 'angle-double-down', [dnd5eMovement, pf1Movement, pf2Movement]),
  multiMovement('climb', 'spider', [dnd5eMovement, pf1Movement, pf2Movement]),
  multiMovement('fly', 'feather-alt', [dnd5eMovement, pf1Movement, pf2Movement]),
  multiMovement('swim', 'swimmer', [dnd5eMovement, pf1Movement, pf2Movement]),
];

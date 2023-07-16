import capitalize from '../../../dataConversion/capitalize';
import calculateValue from '../../../tooltip/calculateValue';
import isLiteNPC from './isLiteNPC';

const d35eOrPF1Movement = (key: string) => {
  return (actor: Actor) => {
    if (isLiteNPC(actor)) {
      return null;
    }
    const value = calculateValue(foundry.utils.getProperty(actor.system, `attributes.speed.${key}`));
    if (value && typeof value.value === 'number' && value.value > 0) {
      if (key === 'fly') {
        const maneuverAbility = foundry.utils.getProperty(actor.system, 'attributes.speed.fly.maneuverability');
        if (typeof maneuverAbility === 'string') {
          const maneuverKey = `PF1.FlyManeuverability${capitalize(maneuverAbility)}`;
          let maneuverLabel = maneuverAbility;
          if (game.i18n.has(maneuverKey)) {
            maneuverLabel = game.i18n.localize(maneuverKey);
          }
          value.extra = maneuverLabel;
        }
      }
      return value;
    }
    return null;
  };
};

export default d35eOrPF1Movement;

import calculateValue from '../../../tooltip/calculateValue';

const dnd5eMovement = (key: string) => {
  return (actor: Actor) => {
    const value = calculateValue(foundry.utils.getProperty(actor.system, `attributes.movement.${key}`));
    if (value && value.value > 0) {
      const units = foundry.utils.getProperty(actor.system, 'attributes.movement.units');
      if (typeof units === 'string') {
        value.units = units;
      }
      return value;
    }
    return null;
  };
};

export default dnd5eMovement;

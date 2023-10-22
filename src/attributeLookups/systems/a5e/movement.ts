import unknownObject from '../../../dataConversion/unknownObject';
import { CalculatedValue } from '../../../tooltip/calculateValue';

const a5eMovement = (key: string) => {
  return (actor: Actor): CalculatedValue | null => {
    const value = unknownObject(foundry.utils.getProperty(actor.system, `attributes.movement.${key}`));
    if (value && typeof value.distance === 'number' && value.distance > 0) {
      const units = value.unit;
      if (typeof units === 'string') {
        return {
          value: value.distance,
          units: units,
        };
      }
      return { value: value.distance };
    }
    return null;
  };
};

export default a5eMovement;

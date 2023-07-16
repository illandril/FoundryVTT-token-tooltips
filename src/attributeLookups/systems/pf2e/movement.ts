import unknownObject from '../../../dataConversion/unknownObject';
import calculateValue, { CalculatedValue } from '../../../tooltip/calculateValue';

const pf2Movement = (key: string) => {
  return (actor: Actor) => {
    const speed = unknownObject(foundry.utils.getProperty(actor.system, 'attributes.speed'));
    if (!speed) {
      return null;
    }
    let value: CalculatedValue | null | undefined;
    if (speed.type === key) {
      value = calculateValue(speed);
    } else {
      if (Array.isArray(speed.otherSpeeds)) {
        for (const maybeOtherSpeed of speed.otherSpeeds) {
          const otherSpeed = unknownObject(maybeOtherSpeed);
          if (otherSpeed?.type === key) {
            value = calculateValue(otherSpeed);
            break;
          }
        }
      }
    }
    if (value && typeof value.value === 'number' && value.value > 0) {
      return value;
    }
    return null;
  };
};

export default pf2Movement;

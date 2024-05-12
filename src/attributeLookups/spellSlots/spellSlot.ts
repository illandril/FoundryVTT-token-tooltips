import calculateValue from '../../tooltip/calculateValue';
import AttributeLookup from '../AttributeLookup';
import spellIcon from './spellIcon';

type MaybeSetSlotsObject = {
  total?: unknown;
  value?: unknown;
  current?: unknown;
  max?: unknown;
};
const isSetSlots = (value: unknown) => {
  if (value === null) {
    return false;
  }
  if (isSetSlotsValue(value)) {
    return true;
  }
  if (typeof value === 'object') {
    const objValue = value as MaybeSetSlotsObject;
    if (isSetSlotsValue(objValue.total) || isSetSlotsValue(objValue.value) || isSetSlotsValue(objValue.current)) {
      return isNonZeroMax(objValue.max);
    }
  }
  return false;
};

const isNonZeroMax = (value: unknown) => {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === 'number') {
    return !Number.isNaN(value) && value > 0;
  }
  return typeof value === 'string' && value !== '';
};

const isSetSlotsValue = (value: unknown) => {
  if (typeof value === 'number') {
    return !Number.isNaN(value);
  }
  if (typeof value === 'string') {
    return value !== '';
  }
  return false;
};

const spellSlot = (key: string, displayKey: string | number) => {
  const label = () => (typeof displayKey === 'number' ? `${displayKey}` : game.i18n.localize(displayKey));
  return new AttributeLookup(
    () => spellIcon(label()),
    label,
    (actor: Actor) => {
      const slots = foundry.utils.getProperty(actor, key);
      if (isSetSlots(slots)) {
        return calculateValue(slots);
      }
      return null;
    },
  );
};

export default spellSlot;

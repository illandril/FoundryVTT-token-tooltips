import calculateValue, { CalculatedValue } from '../tooltip/calculateValue';

type Icon = string | HTMLElement | null;
type Label = string;
type Value = CalculatedValue | null;

type IconLookup = () => Icon;
type LabelLookup = () => Label;
export type ValueLookup = (actor: Actor, token: Token) => Value;

export default class AttributeLookup {
  constructor(
    public readonly icon: IconLookup,
    public readonly label: LabelLookup,
    public readonly value: ValueLookup,
  ) {}
}

export type AsyncRow = {
  icon: Icon
  label: Label
  value: Value
};
type AsyncRowLookup = (actor: Actor, token: Token) => Promise<AsyncRow[]>;

export class AsyncAttributeLookup {
  constructor(
    public readonly id: string,
    public readonly asyncRows: AsyncRowLookup,
  ) {}
}

export const getAttributeValue = (object: unknown, valueKeys: string[]): CalculatedValue | null => {
  for (const key of valueKeys) {
    const attribute = foundry.utils.getProperty(object, key);
    const value = calculateValue(attribute, key);
    if (value !== null) {
      return value;
    }
  }
  return null;
};

export class SimpleActorAttributeLookup extends AttributeLookup {
  constructor(icon: IconLookup, label: LabelLookup, valueKeys: string[]) {
    super(icon, label, (actor: Actor) => getAttributeValue(actor, valueKeys));
  }
}

export class SimpleTokenAttributeLookup extends AttributeLookup {
  constructor(icon: IconLookup, label: LabelLookup, valueKeys: string[]) {
    super(icon, label, (_actor: Actor, token: Token) => getAttributeValue(token, valueKeys));
  }
}

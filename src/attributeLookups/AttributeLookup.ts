import calculateValue, { CalculatedValue } from '../tooltip/calculateValue';

type IconLookup = () => string | null;
type LabelLookup = () => string;
type ValueLookup = (actor: Actor, token: Token) => CalculatedValue | null;

export default class AttributeLookup {
  constructor(
    public icon: IconLookup,
    public label: LabelLookup,
    public value: ValueLookup,
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

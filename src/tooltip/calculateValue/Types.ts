export type MaybeAttributeObject = Record<string, unknown>;

export type ValidNonArrayAttributeType = Node | number | string | boolean;

export type ValidAttributeType = ValidNonArrayAttributeType | ValidNonArrayAttributeType[];

export type CalculatedValue = {
  value: ValidNonArrayAttributeType;
  max?: ValidNonArrayAttributeType | null;
  temp?: string | number | null;
  tempmax?: string | number | null;
  units?: string | null;
  extra?: string | null;
};

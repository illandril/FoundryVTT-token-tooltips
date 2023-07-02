export type LocalizedAndRawValue = {
  localized: string
  raw: string
};

export type LocalizedValueSimplifier = (value: LocalizedAndRawValue) => Node;

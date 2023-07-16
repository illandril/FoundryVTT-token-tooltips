export type LocalizedAndRawValue = {
  localized: string
  raw: string
  suffix?: string
};

export type LocalizedValueSimplifier = (value: LocalizedAndRawValue) => Node;

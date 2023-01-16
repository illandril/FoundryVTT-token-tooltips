export type Operation = (a: number, b: number) => number | null;

export const add: Operation = (a, b) => a + b;

const operations = {
  '+': add,
  '*': (a, b) => a * b,
  '/': (a, b) => b === 0 ? null : a / b,
  '%': (a, b) => a % b,
  '>': (a, b) => a > b ? a : null,
  '>=': (a, b) => a >= b ? a : null,
  '<': (a, b) => a < b ? a : null,
  '<=': (a, b) => a <= b ? a : null,
  '!=': (a, b) => a !== b ? a : null,
  '==': (a, b) => a === b ? a : null,
} satisfies Record<string, Operation>;

type OperationKey = keyof typeof operations;
const operationKeys = Object.keys(operations);

export const getOperation = (key: string): Operation | null => {
  if (operationKeys.includes(key)) {
    return operations[key as unknown as OperationKey];
  }
  return null;
};

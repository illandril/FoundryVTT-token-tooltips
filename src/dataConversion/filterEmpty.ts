const filterEmpty = <T>(value: T | null | undefined): value is T => !(
  value === undefined
  || value === ''
  || value === null
  || typeof value === 'number' && isNaN(value)
  || value instanceof Text && value.textContent === ''
);

export default filterEmpty;

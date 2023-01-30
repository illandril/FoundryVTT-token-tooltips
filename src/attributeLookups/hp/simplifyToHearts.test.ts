import simplifyToHearts from './simplifyToHearts';

describe('4-hearts', () => {
  const numHearts = 4;
  it.each([-100, -50, 0])('should show 0 hearts at %i', (value) => {
    const simplified = simplifyToHearts({
      value,
      max: 100,
    }, numHearts);

    expect(simplified.value).toBeInstanceOf(HTMLElement);
    const node = simplified.value as HTMLElement;
    const fullHearts = node.querySelectorAll('.fas.fa-heart');
    const emptyHearts = node.querySelectorAll('.fat.fa-heart');
    expect(fullHearts).toHaveLength(0);
    expect(emptyHearts).toHaveLength(4);
  });
  it.each([1, 25])('should show 1 hearts at %i', (value) => {
    const simplified = simplifyToHearts({
      value,
      max: 100,
    }, numHearts);

    const node = simplified.value as HTMLElement;
    const fullHearts = node.querySelectorAll('.fas.fa-heart');
    const emptyHearts = node.querySelectorAll('.fat.fa-heart');
    expect(fullHearts).toHaveLength(1);
    expect(emptyHearts).toHaveLength(3);
  });
  it.each([26, 50])('should show 2 hearts at %i', (value) => {
    const simplified = simplifyToHearts({
      value,
      max: 100,
    }, numHearts);

    const node = simplified.value as HTMLElement;
    const fullHearts = node.querySelectorAll('.fas.fa-heart');
    const emptyHearts = node.querySelectorAll('.fat.fa-heart');
    expect(fullHearts).toHaveLength(2);
    expect(emptyHearts).toHaveLength(2);
  });
  it.each([51, 75])('should show 3 hearts at %i', (value) => {
    const simplified = simplifyToHearts({
      value,
      max: 100,
    }, numHearts);

    const node = simplified.value as HTMLElement;
    const fullHearts = node.querySelectorAll('.fas.fa-heart');
    const emptyHearts = node.querySelectorAll('.fat.fa-heart');
    expect(fullHearts).toHaveLength(3);
    expect(emptyHearts).toHaveLength(1);
  });
  it.each([76, 100, 101, 150, 200])('should show 4 hearts at %i', (value) => {
    const simplified = simplifyToHearts({
      value,
      max: 100,
    }, numHearts);

    const node = simplified.value as HTMLElement;
    const fullHearts = node.querySelectorAll('.fas.fa-heart');
    const emptyHearts = node.querySelectorAll('.fat.fa-heart');
    expect(fullHearts).toHaveLength(4);
    expect(emptyHearts).toHaveLength(0);
  });
});

describe('5-hearts', () => {
  const numHearts = 5;
  it.each([-100, -50, 0])('should show 0 hearts at %i', (value) => {
    const simplified = simplifyToHearts({
      value,
      max: 100,
    }, numHearts);

    expect(simplified.value).toBeInstanceOf(HTMLElement);
    const node = simplified.value as HTMLElement;
    const fullHearts = node.querySelectorAll('.fas.fa-heart');
    const emptyHearts = node.querySelectorAll('.fat.fa-heart');
    expect(fullHearts).toHaveLength(0);
    expect(emptyHearts).toHaveLength(5);
  });
  it.each([1, 20])('should show 1 hearts at %i', (value) => {
    const simplified = simplifyToHearts({
      value,
      max: 100,
    }, numHearts);

    const node = simplified.value as HTMLElement;
    const fullHearts = node.querySelectorAll('.fas.fa-heart');
    const emptyHearts = node.querySelectorAll('.fat.fa-heart');
    expect(fullHearts).toHaveLength(1);
    expect(emptyHearts).toHaveLength(4);
  });
  it.each([21, 40])('should show 2 hearts at %i', (value) => {
    const simplified = simplifyToHearts({
      value,
      max: 100,
    }, numHearts);

    const node = simplified.value as HTMLElement;
    const fullHearts = node.querySelectorAll('.fas.fa-heart');
    const emptyHearts = node.querySelectorAll('.fat.fa-heart');
    expect(fullHearts).toHaveLength(2);
    expect(emptyHearts).toHaveLength(3);
  });
  it.each([41, 60])('should show 3 hearts at %i', (value) => {
    const simplified = simplifyToHearts({
      value,
      max: 100,
    }, numHearts);

    const node = simplified.value as HTMLElement;
    const fullHearts = node.querySelectorAll('.fas.fa-heart');
    const emptyHearts = node.querySelectorAll('.fat.fa-heart');
    expect(fullHearts).toHaveLength(3);
    expect(emptyHearts).toHaveLength(2);
  });
  it.each([61, 80])('should show 3 hearts at %i', (value) => {
    const simplified = simplifyToHearts({
      value,
      max: 100,
    }, numHearts);

    const node = simplified.value as HTMLElement;
    const fullHearts = node.querySelectorAll('.fas.fa-heart');
    const emptyHearts = node.querySelectorAll('.fat.fa-heart');
    expect(fullHearts).toHaveLength(4);
    expect(emptyHearts).toHaveLength(1);
  });
  it.each([81, 100, 101, 150, 200])('should show 5 hearts at %i', (value) => {
    const simplified = simplifyToHearts({
      value,
      max: 100,
    }, numHearts);

    const node = simplified.value as HTMLElement;
    const fullHearts = node.querySelectorAll('.fas.fa-heart');
    const emptyHearts = node.querySelectorAll('.fat.fa-heart');
    expect(fullHearts).toHaveLength(5);
    expect(emptyHearts).toHaveLength(0);
  });
});

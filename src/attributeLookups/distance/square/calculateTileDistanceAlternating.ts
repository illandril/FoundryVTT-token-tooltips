import calculateTileOffset from './calculateTileOffset';

const calculateAlternating = (a: number, b: number) => {
  if (a === 0) {
    return b;
  }
  if (b === 0) {
    return a;
  }
  const diagonal = Math.min(a, b);
  const straight = Math.abs(a - b);
  return Math.floor(1.5 * diagonal) + straight;
};

const calculateTileDistanceAlternating = (grid: GridLayer, token: Token, other: Token) => {
  const tileOffset = calculateTileOffset(grid, token, other);
  const flatDistance = calculateAlternating(tileOffset.horizontal, tileOffset.vertical);
  return calculateAlternating(flatDistance, tileOffset.elevation);
};

export default calculateTileDistanceAlternating;

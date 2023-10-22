import calculateTileOffset from './calculateTileOffset';

const calculateTileDistanceEquidistant = (grid: GridLayer, token: Token, other: Token) => {
  const tileOffset = calculateTileOffset(grid, token, other);
  return Math.max(tileOffset.horizontal, tileOffset.vertical, tileOffset.elevation);
};

export default calculateTileDistanceEquidistant;

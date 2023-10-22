import calculateDistanceEuclidian from '../calculateDistanceEuclidian';
import calculateTileDistanceAlternating from './calculateTileDistanceAlternating';
import calculateTileDistanceEquidistant from './calculateTileDistanceEquidistant';
import calculateTileOffset from './calculateTileOffset';
import { SquareDistanceChoice, SquareIncludeElevation, SquareMeasureFrom } from './squareSettings';


const calculateSquareDistanceGridSpaces = (grid: GridLayer, token: Token, other: Token) => {
  const tileOffset = calculateTileOffset(grid, token, other);
  return grid.measureDistance(
    { x: 0, y: 0 },
    { x: tileOffset.horizontal * grid.size, y: tileOffset.vertical * grid.size },
    { gridSpaces: true },
  );
};

const calculateSquareDistanceEuclidian = (grid: GridLayer, token: Token, other: Token) => {
  const includeElevation = SquareIncludeElevation.get();
  const measureFrom = SquareMeasureFrom.get();
  const tileDistance = grid.grid.options.dimensions.distance;
  const from = {
    x: token.center.x / grid.size * tileDistance,
    y: token.center.y / grid.size * tileDistance,
    elevation: includeElevation ? token.document.elevation || 0 : 0,
  };
  const to = {
    x: other.center.x / grid.size * tileDistance,
    y: other.center.y / grid.size * tileDistance,
    elevation: includeElevation ? other.document.elevation || 0 : 0,
  };
  if (measureFrom === 'NEAREST') {
    const tileOffset = calculateTileOffset(grid, token, other);
    from.x = 0;
    from.y = 0;
    to.x = tileOffset.horizontal * tileDistance;
    to.y = tileOffset.vertical * tileDistance;
  }
  return calculateDistanceEuclidian(from, to);
};

const calculateSquareDistanceEquidistant = (grid: GridLayer, token: Token, other: Token) => {
  return calculateTileDistanceEquidistant(grid, token, other) * grid.grid.options.dimensions.distance;
};
const calculateSquareDistanceAlternating = (grid: GridLayer, token: Token, other: Token) => {
  return calculateTileDistanceAlternating(grid, token, other) * grid.grid.options.dimensions.distance;
};

const calculateSquareDistance = (grid: GridLayer, token: Token, other: Token) => {
  switch (SquareDistanceChoice.get()) {
    case 'ALTERNATING':
      return calculateSquareDistanceAlternating(grid, token, other);
    case 'EQUIDISTANT':
      return calculateSquareDistanceEquidistant(grid, token, other);
    case 'EUCLIDIAN':
      return calculateSquareDistanceEuclidian(grid, token, other);
    case 'GRID':
    default:
      return calculateSquareDistanceGridSpaces(grid, token, other);
  }
};

export default calculateSquareDistance;

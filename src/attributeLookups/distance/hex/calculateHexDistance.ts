import calculateDistanceEuclidian from '../calculateDistanceEuclidian';
import { HexDistanceChoice, HexIncludeElevation } from './hexSettings';


const calculateHexDistanceGridSpaces = (grid: GridLayer, token: Token, other: Token) => {
  return grid.measureDistance(
    token.center,
    other.center,
    { gridSpaces: true },
  );
};

const calculateHexDistanceEuclidian = (grid: GridLayer, token: Token, other: Token) => {
  const includeElevation = HexIncludeElevation.get();
  const tileDistance = grid.grid.options.dimensions.distance;
  return calculateDistanceEuclidian({
    x: token.center.x / grid.size * tileDistance,
    y: token.center.y / grid.size * tileDistance,
    elevation: includeElevation ? token.document.elevation || 0 : 0,
  }, {
    x: other.center.x / grid.size * tileDistance,
    y: other.center.y / grid.size * tileDistance,
    elevation: includeElevation ? other.document.elevation || 0 : 0,
  });
};

const calculateHexDistance = (grid: GridLayer, token: Token, other: Token) => {
  switch (HexDistanceChoice.get()) {
    case 'EUCLIDIAN':
      return calculateHexDistanceEuclidian(grid, token, other);
    case 'GRID':
    default:
      return calculateHexDistanceGridSpaces(grid, token, other);
  }
};

export default calculateHexDistance;

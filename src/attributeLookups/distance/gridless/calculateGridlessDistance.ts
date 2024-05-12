import calculateDistanceEuclidian from '../calculateDistanceEuclidian';
import { GridlessIncludeElevation } from './gridlessSettings';

const calculateGridlessDistance = (grid: GridLayer, token: Token, other: Token) => {
  const includeElevation = GridlessIncludeElevation.get();
  const tileDistance = grid.grid.options.dimensions.distance;
  const from = {
    x: (token.center.x / grid.size) * tileDistance,
    y: (token.center.y / grid.size) * tileDistance,
    elevation: includeElevation ? token.document.elevation || 0 : 0,
  };
  const to = {
    x: (other.center.x / grid.size) * tileDistance,
    y: (other.center.y / grid.size) * tileDistance,
    elevation: includeElevation ? other.document.elevation || 0 : 0,
  };
  return calculateDistanceEuclidian(from, to);
};

export default calculateGridlessDistance;

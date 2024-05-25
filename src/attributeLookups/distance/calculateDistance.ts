import calculateGridlessDistance from './gridless/calculateGridlessDistance';
import calculateHexDistance from './hex/calculateHexDistance';
import calculateSquareDistance from './square/calculateSquareDistance';

const calculateDistance = (grid: GridLayer, token: Token, other: Token) => {
  let distance: number;
  switch (grid.grid.type) {
    case foundry.CONST.GRID_TYPES.HEXEVENQ:
    case foundry.CONST.GRID_TYPES.HEXEVENR:
    case foundry.CONST.GRID_TYPES.HEXODDQ:
    case foundry.CONST.GRID_TYPES.HEXODDR:
      // Hex
      distance = calculateHexDistance(grid, token, other);
      break;
    case foundry.CONST.GRID_TYPES.SQUARE:
      distance = calculateSquareDistance(grid, token, other);
      break;
    default:
      // Gridless (or unknown grid type)
      distance = calculateGridlessDistance(grid, token, other);
  }
  return distance;
};

export default calculateDistance;

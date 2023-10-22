import calculateDistance from './calculateDistance';

const calculateDistanceWithUnits = (scene: Scene, grid: GridLayer, token: Token, other: Token) => {
  const distance = calculateDistance(grid, token, other);

  return {
    value: distance.toFixed(2).replace(/(\.0)?0$/, ''),
    units: scene.grid.units,
  };
};

export default calculateDistanceWithUnits;

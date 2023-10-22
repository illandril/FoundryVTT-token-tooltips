const getTile = (pos: number, size: number) => {
  return Math.floor(pos / size);
};
const getTiles = (grid: GridLayer, bounds: PIXI.Rectangle) => {
  return {
    left: getTile(bounds.left, grid.size),
    right: getTile(bounds.right - 0.1, grid.size),
    top: getTile(bounds.top, grid.size),
    bottom: getTile(bounds.bottom - 0.1, grid.size),
  };
};

export default getTiles;

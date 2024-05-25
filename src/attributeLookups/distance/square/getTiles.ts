const getTile = (pos: number, size: number) => {
  return Math.floor(pos / size);
};
const getTiles = (grid: GridLayer, bounds: PIXI.Rectangle) => {
  return {
    left: getTile(bounds.left, grid.grid.size),
    right: getTile(bounds.right - 0.1, grid.grid.size),
    top: getTile(bounds.top, grid.grid.size),
    bottom: getTile(bounds.bottom - 0.1, grid.grid.size),
  };
};

export default getTiles;

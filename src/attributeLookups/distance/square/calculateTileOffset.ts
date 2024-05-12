import getTiles from './getTiles';
import { SquareIncludeElevation, SquareMeasureFrom } from './squareSettings';

const getOffset = (a1: number, a2: number, b1: number, b2: number) => {
  let offset: number;
  const measureFrom = SquareMeasureFrom.get();
  if (measureFrom === 'NEAREST') {
    if (a1 <= b2 && a2 >= b1) {
      // Overlapping
      offset = 0;
    } else if (a1 > b2) {
      // A is after B
      offset = a1 - b2;
    } else {
      // B is after A
      offset = b1 - a2;
    }
  } else {
    const aC = (a1 + a2) / 2;
    const bC = (b1 + b2) / 2;
    if (aC === bC) {
      offset = 0;
    } else {
      const aCL = Math.floor(aC);
      const aCH = Math.ceil(aC);
      const bCL = Math.floor(bC);
      const bCH = Math.ceil(bC);
      const offsets = [Math.abs(aCL - bCL), Math.abs(aCL - bCH), Math.abs(aCH - bCL), Math.abs(aCH - bCH)];
      if (measureFrom === 'CENTER_FAR') {
        offset = Math.max(...offsets);
      } else {
        offset = Math.min(...offsets);
      }
    }
  }
  return offset;
};

const calculateTileOffset = (grid: GridLayer, token: Token, other: Token) => {
  const tokenTiles = getTiles(grid, token.bounds);
  const otherTiles = getTiles(grid, other.bounds);

  const horizontal = getOffset(tokenTiles.left, tokenTiles.right, otherTiles.left, otherTiles.right);
  const vertical = getOffset(tokenTiles.top, tokenTiles.bottom, otherTiles.top, otherTiles.bottom);

  let elevation: number;
  if (SquareIncludeElevation.get()) {
    const tokenElevationTiles = token.document.elevation / grid.grid.options.dimensions.distance;
    const otherElevationTiles = other.document.elevation / grid.grid.options.dimensions.distance;
    elevation = getOffset(tokenElevationTiles, tokenElevationTiles, otherElevationTiles, otherElevationTiles);
  } else {
    elevation = 0;
  }

  return {
    horizontal,
    vertical,
    elevation,
  };
};

export default calculateTileOffset;

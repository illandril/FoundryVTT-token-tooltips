type Position = {
  x: number
  y: number
  elevation: number
};

const calculateDistanceEuclidian = (from: Position, to: Position) => {
  const horizontal = from.x - to.x;
  const vertical = from.y - to.y;
  const elevation = from.elevation - to.elevation;
  return Math.sqrt(horizontal * horizontal + vertical * vertical + elevation * elevation);
};

export default calculateDistanceEuclidian;

import AttributeLookup from './AttributeLookup';

const getActiveToken = () => {
  const speaker = ChatMessage.getSpeaker();
  if (!speaker.token) {
    return null;
  }
  return game.canvas.tokens?.get(speaker.token);
};

type PointsAndCenter = {
  points: Point[];
  trueCenter: Point;
};

const getPolygon = (grid: foundry.grid.BaseGrid, token: Token) => {
  let poly: PIXI.Polygon;
  if (token.shape instanceof PIXI.Circle) {
    poly = token.shape.toPolygon({ density: (token.shape.radius * 8) / grid.size });
  } else if (token.shape instanceof PIXI.Rectangle) {
    poly = token.shape.toPolygon();
  } else {
    poly = token.shape;
  }

  return new PIXI.Polygon(poly.points.map((point, i) => point + (i % 2 ? token.bounds.top : token.bounds.left)));
};

const getPointsAndCenter = (grid: foundry.grid.BaseGrid, shape: PIXI.Polygon): PointsAndCenter => {
  const points: Point[] = [];
  for (let i = 0; i < shape.points.length; i += 2) {
    const x = shape.points[i];
    const y = shape.points[i + 1];
    points.push({ x, y });

    const nextX = shape.points[i + 2] ?? shape.points[0];
    const nextY = shape.points[i + 3] ?? shape.points[1];
    const d = Math.sqrt((x - nextX) ** 2 + (y - nextY) ** 2);
    const steps = Math.ceil((d * 2) / grid.size);

    for (let step = 1; step < steps; step++) {
      points.push({ x: ((nextX - x) / steps) * step + x, y: ((nextY - y) / steps) * step + y });
    }
  }

  return {
    points: points,
    trueCenter: shape.getBounds().center,
  };
};

const getPoints = (grid: foundry.grid.BaseGrid, poly: PIXI.Polygon) => {
  const bounds = poly.getBounds();
  const pointsToMeasure: Point[] = [bounds.center];

  // If either dimension is one grid space long or less, just use the center point for measurements
  // Otherwise, we use the center of the grid spaces along the token's perimeter
  const forcedX = bounds.width <= grid.sizeX ? bounds.center.x : null;
  const forcedY = bounds.height <= grid.sizeY ? bounds.center.x : null;

  if (typeof forcedX !== 'number' || typeof forcedY !== 'number') {
    const { points, trueCenter } = getPointsAndCenter(grid, poly);
    for (const point of points) {
      const x = (point.x - trueCenter.x) * 0.99 + trueCenter.x;
      const y = (point.y - trueCenter.y) * 0.99 + trueCenter.y;
      const pointToMeasure = grid.getCenterPoint({ x, y });
      pointToMeasure.x = forcedX ?? pointToMeasure.x;
      pointToMeasure.y = forcedY ?? pointToMeasure.y;
      if (
        !pointsToMeasure.some((priorPoint) => priorPoint.x === pointToMeasure.x && priorPoint.y === pointToMeasure.y)
      ) {
        pointsToMeasure.push(pointToMeasure);
      }
    }
  }
  return pointsToMeasure;
};

const squareDistance = (pointA: Point, pointB: Point) => (pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2;

const getComparisonPoints = (grid: foundry.grid.BaseGrid, token: Token, other: Token): [Point, Point] => {
  const polyA = getPolygon(grid, token);
  const polyB = getPolygon(grid, other);

  const pointsA = getPoints(grid, polyA);
  const pointsB = getPoints(grid, polyB);
  const containedPoint =
    pointsA.find((point) => polyB.contains(point.x, point.y)) ??
    pointsB.find((point) => polyA.contains(point.x, point.y));
  if (containedPoint) {
    // A contains B or B contains A... so ensure the distance is 0
    return [containedPoint, containedPoint];
  }

  let closestPointA: Point = token.center;
  let closestPointB: Point = other.center;
  let closestD2 = squareDistance(closestPointA, closestPointB);
  for (const pointA of pointsA) {
    for (const pointB of pointsB) {
      const d2 = squareDistance(pointA, pointB);
      if (d2 < closestD2) {
        closestD2 = d2;
        closestPointA = pointA;
        closestPointB = pointB;
      }
    }
  }
  return [closestPointA, closestPointB];
};

const calculateDistanceWithUnits = (scene: Scene, grid: foundry.grid.BaseGrid, token: Token, other: Token) => {
  const { distance } = grid.measurePath(getComparisonPoints(grid, token, other));

  return {
    value: distance,
    units: scene.grid.units,
  };
};

export default [
  new AttributeLookup(
    () => 'ruler',
    () => game.i18n.localize('Distance'),
    (_actor, token) => {
      const grid = game.canvas.grid;
      const scene = game.canvas.scene;
      if (!(grid && scene)) {
        return null;
      }
      const other = getActiveToken();
      if (!other) {
        return null;
      }

      return calculateDistanceWithUnits(scene, grid, token, other);
    },
  ),
] satisfies AttributeLookup[];

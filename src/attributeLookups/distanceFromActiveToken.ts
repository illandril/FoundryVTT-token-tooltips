import AttributeLookup from './AttributeLookup';
// import calculateDistanceWithUnits from './distance/calculateDistanceWithUnits';

const getActiveToken = () => {
  const speaker = ChatMessage.getSpeaker();
  if (!speaker.token) {
    return null;
  }
  return game.canvas.tokens?.get(speaker.token);
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Legacy
const calculateDistance = (grid: GridLayer, token: Token, other: Token): number => {
  const ttRect = other.bounds;
  const atRect = token.bounds;
  const ttPos = { x: other.center.x, y: other.center.y };
  const atPos = { x: token.center.x, y: token.center.y };
  if (ttRect.width > grid.grid.size) {
    if (ttRect.right < atRect.left) {
      ttPos.x = ttRect.right - grid.grid.size / 2;
    } else if (ttRect.left > atRect.right) {
      ttPos.x = ttRect.left + grid.grid.size / 2;
    } else {
      ttPos.x = atPos.x;
    }
  }
  if (ttRect.height > grid.grid.size) {
    if (ttRect.bottom < atRect.top) {
      ttPos.y = ttRect.bottom - grid.grid.size / 2;
    } else if (ttRect.top > atRect.bottom) {
      ttPos.y = ttRect.top + grid.grid.size / 2;
    } else {
      ttPos.y = atPos.y;
    }
  }
  if (atRect.width > grid.grid.size) {
    if (atRect.right < ttRect.left) {
      atPos.x = atRect.right - grid.grid.size / 2;
    } else if (atRect.left > ttRect.right) {
      atPos.x = atRect.left + grid.grid.size / 2;
    } else {
      atPos.x = ttPos.x;
    }
  }
  if (atRect.height > grid.grid.size) {
    if (atRect.bottom < ttRect.top) {
      atPos.y = atRect.bottom - grid.grid.size / 2;
    } else if (atRect.top > ttRect.bottom) {
      atPos.y = atRect.top + grid.grid.size / 2;
    } else {
      atPos.y = ttPos.y;
    }
  }
  return grid.measureDistance(ttPos, atPos, { gridSpaces: true });
};

const calculateDistanceWithUnits = (scene: Scene, grid: GridLayer, token: Token, other: Token) => {
  const distance = calculateDistance(grid, token, other);

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
      const grid = game.canvas.interface?.grid;
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

import AttributeLookup from './AttributeLookup';

const getActiveToken = () => {
  const speaker = ChatMessage.getSpeaker();
  if (!speaker.token) {
    return null;
  }
  return game.canvas.tokens?.get(speaker.token);
};

const calculateDistance = (grid: GridLayer, activeToken: Token, targetToken: Token): number => {
  const ttRect = targetToken.bounds;
  const atRect = activeToken.bounds;
  const ttPos = { x: targetToken.center.x, y: targetToken.center.y };
  const atPos = { x: activeToken.center.x, y: activeToken.center.y };
  if (ttRect.width > grid.size) {
    if (ttRect.right < atRect.left) {
      ttPos.x = ttRect.right - grid.size / 2;
    } else if (ttRect.left > atRect.right) {
      ttPos.x = ttRect.left + grid.size / 2;
    } else {
      ttPos.x = atPos.x;
    }
  }
  if (ttRect.height > grid.size) {
    if (ttRect.bottom < atRect.top) {
      ttPos.y = ttRect.bottom - grid.size / 2;
    } else if (ttRect.top > atRect.bottom) {
      ttPos.y = ttRect.top + grid.size / 2;
    } else {
      ttPos.y = atPos.y;
    }
  }
  if (atRect.width > grid.size) {
    if (atRect.right < ttRect.left) {
      atPos.x = atRect.right - grid.size / 2;
    } else if (atRect.left > ttRect.right) {
      atPos.x = atRect.left + grid.size / 2;
    } else {
      atPos.x = ttPos.x;
    }
  }
  if (atRect.height > grid.size) {
    if (atRect.bottom < ttRect.top) {
      atPos.y = atRect.bottom - grid.size / 2;
    } else if (atRect.top > ttRect.bottom) {
      atPos.y = atRect.top + grid.size / 2;
    } else {
      atPos.y = ttPos.y;
    }
  }
  return grid.measureDistance(ttPos, atPos, { gridSpaces: true });
};

export default [
  new AttributeLookup(
    () => 'ruler',
    () => game.i18n.localize('Distance'),
    (_actor, token) => {
      const grid = game.canvas.grid;
      const scene = game.canvas.scene;
      if (!grid || !scene) {
        return null;
      }
      const activeToken = getActiveToken();
      if (!activeToken) {
        return null;
      }

      const distance = calculateDistance(grid, activeToken, token);

      return {
        value: distance,
        units: scene.grid.units,
      };
    },
  ),
] satisfies AttributeLookup[];

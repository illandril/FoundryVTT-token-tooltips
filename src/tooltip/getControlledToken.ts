import module from '../module';

export const getControlledToken = () => {
  const tokens = game.canvas.tokens?.controlled;
  module.logger.debug('getControlledToken', tokens);
  if (tokens && tokens.length === 1) {
    return tokens[0];
  }
  return null;
};

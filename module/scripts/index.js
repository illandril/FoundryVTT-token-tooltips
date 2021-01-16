import './settings.js';
import './actor-settings.js';
import './tooltip.js';

Hooks.once('ready', () => {
  // Workaround for the hover spam issue: https://gitlab.com/foundrynet/foundryvtt/-/issues/3506
  canvas.app.renderer.plugins.interaction.moveWhenInside = true;
});

import type AttributeLookup from './AttributeLookup';
import getA5eAttributes from './systems/a5e/getAttributes';
import a5eSystemID from './systems/a5e/systemID';
import d35eSystemID from './systems/d35e/systemID';
import getD35eAndPF1Attributes from './systems/d35eOrPF1/getAttributes';
import getDND5eAttributes from './systems/dnd5e/getAttributes';
import dnd5eSystemID from './systems/dnd5e/systemID';
import pf1SystemID from './systems/pf1/systemID';
import getPF2Attributes from './systems/pf2e/getAttributes';
import pf2eSystemID from './systems/pf2e/systemID';

const values: AttributeLookup[] = [];
Hooks.once('ready', () => {
  switch (game.system.id) {
    case a5eSystemID:
      values.push(...getA5eAttributes());
      break;
    case dnd5eSystemID:
      values.push(...getDND5eAttributes());
      break;
    case d35eSystemID:
    case pf1SystemID:
      values.push(...getD35eAndPF1Attributes());
      break;
    case pf2eSystemID:
      values.push(...getPF2Attributes());
      break;
    default:
    // No defaults
  }
});

export const supportedSystems = [a5eSystemID, d35eSystemID, dnd5eSystemID, pf1SystemID, pf2eSystemID];
export default values;

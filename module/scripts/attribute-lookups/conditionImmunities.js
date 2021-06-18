import d35eTraitArrayWithCustom from './d35e/traitArrayWithCustom.js';
import d35eSystemID from './d35e/systemID.js';

import dnd5eTraitArrayWithCustom from './dnd5e/traitArrayWithCustom.js';
import dnd5eSystemID from './dnd5e/systemID.js';

import pf1TraitArrayWithCustom from './pf1/traitArrayWithCustom.js';
import pf1SystemID from './pf1/systemID.js';

export const supportedSystems = [d35eSystemID, dnd5eSystemID, pf1SystemID];

export default [
  d35eTraitArrayWithCustom('conditionImmunities', 'ci', 'CondType'),
  dnd5eTraitArrayWithCustom('conditionImmunities', 'ci', 'Con'),
  pf1TraitArrayWithCustom('conditionImmunities', 'ci'),
];

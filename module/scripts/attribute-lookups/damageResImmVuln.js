import dnd5eTraitArrayWithCustom from './dnd5e/traitArrayWithCustom.js';
import dnd5eSystemID from './dnd5e/systemID.js';

import pf1TraitArrayWithCustom from './pf1/traitArrayWithCustom.js';
import pf1SystemID from './pf1/systemID.js';

import pf2eTraitArrayWithCustom from './pf2e/traitArrayWithCustom.js';
import pf2eSystemID from './pf2e/systemID.js';

export const supportedSystems = [dnd5eSystemID, pf1SystemID, pf2eSystemID];

export default [
  dnd5eTraitArrayWithCustom('damageImmunities', 'di', 'Damage'),
  dnd5eTraitArrayWithCustom('damageResistances', 'dr', 'Damage'),
  dnd5eTraitArrayWithCustom('damageVulnerabilities', 'dv', 'Damage'),

  pf1TraitArrayWithCustom('damageImmunities', 'di'),
  pf1TraitArrayWithCustom('damageResistances', 'dr'),
  pf1TraitArrayWithCustom('damageVulnerabilities', 'dv'),

  pf2eTraitArrayWithCustom('damageImmunities', 'di'),
  pf2eTraitArrayWithCustom('damageResistances', 'dr'),
  pf2eTraitArrayWithCustom('weaknesses', 'dv'),
];

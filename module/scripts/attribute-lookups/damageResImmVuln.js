import dnd5eTraitArrayWithCustom from './dnd5e/traitArrayWithCustom.js';
import pf1TraitArrayWithCustom from './pf1/traitArrayWithCustom.js';
import pf2eTraitArrayWithCustom from './pf2e/traitArrayWithCustom.js';

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

import AttributeLookup from './AttributeLookup';
import dnd5eSystemID from './systems/dnd5e/systemID';
import dnd5eTraitArrayWithCustom from './systems/dnd5e/traitArrayWithCustom';
import pf1SystemID from './systems/pf1/systemID';
import pf1TraitArrayWithCustom from './systems/pf1/traitArrayWithCustom';
import iwrLookup from './systems/pf2e/iwrData';
import pf2eSystemID from './systems/pf2e/systemID';
import pf2eTraitArrayWithCustom from './systems/pf2e/traitArrayWithCustom';

export const supportedSystems = [dnd5eSystemID, pf1SystemID, pf2eSystemID];

export default [
  dnd5eTraitArrayWithCustom('damageImmunities', 'di', 'Damage'),
  dnd5eTraitArrayWithCustom('damageResistances', 'dr', 'Damage'),
  dnd5eTraitArrayWithCustom('damageVulnerabilities', 'dv', 'Damage'),

  pf1TraitArrayWithCustom('damageImmunities', 'di'),
  pf1TraitArrayWithCustom('damageResistances', 'dr'),
  pf1TraitArrayWithCustom('damageVulnerabilities', 'dv'),

  // pf2e before 4.6.0
  pf2eTraitArrayWithCustom('damageImmunities', 'di'),
  pf2eTraitArrayWithCustom('damageResistances', 'dr'),
  pf2eTraitArrayWithCustom('weaknesses', 'dv'),

  // pf2e 4.6.0+
  iwrLookup('damageImmunities', 'immunities'),
  iwrLookup('damageResistances', 'resistances'),
  iwrLookup('weaknesses', 'weaknesses'),
] satisfies AttributeLookup[];

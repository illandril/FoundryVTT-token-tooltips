import AttributeLookup from './AttributeLookup';
import simplifyDamageType from './damageTypes/simplifyDamageType';
import dnd5eSystemID from './systems/dnd5e/systemID';
import dnd5eTraitArrayWithCustom from './systems/dnd5e/traitArrayWithCustom';
import pf1SystemID from './systems/pf1/systemID';
import pf1TraitArrayWithCustom from './systems/pf1/traitArrayWithCustom';
import iwrLookup from './systems/pf2e/iwrData';
import pf2eSystemID from './systems/pf2e/systemID';
import pf2eTraitArrayWithCustom from './systems/pf2e/traitArrayWithCustom';

export const supportedSystems = [dnd5eSystemID, pf1SystemID, pf2eSystemID];

export default [
  dnd5eTraitArrayWithCustom('damageImmunities', 'di', 'Damage', simplifyDamageType),
  dnd5eTraitArrayWithCustom('damageResistances', 'dr', 'Damage', simplifyDamageType),
  dnd5eTraitArrayWithCustom('damageVulnerabilities', 'dv', 'Damage', simplifyDamageType),

  pf1TraitArrayWithCustom('damageImmunities', 'di'),
  pf1TraitArrayWithCustom('damageResistances', 'dr'),
  pf1TraitArrayWithCustom('damageVulnerabilities', 'dv'),

  // pf2e before 4.6.0
  pf2eTraitArrayWithCustom('damageImmunities', 'di', simplifyDamageType),
  pf2eTraitArrayWithCustom('damageResistances', 'dr', simplifyDamageType),
  pf2eTraitArrayWithCustom('weaknesses', 'dv', simplifyDamageType),

  // pf2e 4.6.0+
  iwrLookup('damageImmunities', 'immunities', simplifyDamageType),
  iwrLookup('damageResistances', 'resistances', simplifyDamageType),
  iwrLookup('weaknesses', 'weaknesses', simplifyDamageType),
] satisfies AttributeLookup[];

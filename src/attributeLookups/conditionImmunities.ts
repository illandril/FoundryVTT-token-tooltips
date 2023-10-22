import AttributeLookup from './AttributeLookup';
import simplifyDamageType from './damageTypes/simplifyDamageType';
import a5eSystemID from './systems/a5e/systemID';
import a5eTraitArrayWithCustom from './systems/a5e/traitArrayWithCustom';
import d35eSystemID from './systems/d35e/systemID';
import d35eTraitArrayWithCustom from './systems/d35e/traitArrayWithCustom';
import dnd5eSystemID from './systems/dnd5e/systemID';
import dnd5eTraitArrayWithCustom from './systems/dnd5e/traitArrayWithCustom';
import pf1SystemID from './systems/pf1/systemID';
import pf1TraitArrayWithCustom from './systems/pf1/traitArrayWithCustom';
import sfrpgSystemID from './systems/sfrpg/systemID';
import sfrpgTraitArrayWithCustom from './systems/sfrpg/traitArrayWithCustom';

export const supportedSystems = [a5eSystemID, d35eSystemID, dnd5eSystemID, pf1SystemID, sfrpgSystemID];

export default [
  a5eTraitArrayWithCustom('conditionImmunities', 'conditionImmunities', 'Condition', true, simplifyDamageType),
  d35eTraitArrayWithCustom('conditionImmunities', 'ci', 'CondType', simplifyDamageType),
  dnd5eTraitArrayWithCustom('conditionImmunities', 'ci', 'Con', simplifyDamageType),
  pf1TraitArrayWithCustom('conditionImmunities', 'ci', simplifyDamageType),
  sfrpgTraitArrayWithCustom('conditionImmunities', 'ci', 'Conditions', simplifyDamageType),
] satisfies AttributeLookup[];

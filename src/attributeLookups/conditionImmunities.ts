import AttributeLookup from './AttributeLookup';
import d35eSystemID from './systems/d35e/systemID';
import d35eTraitArrayWithCustom from './systems/d35e/traitArrayWithCustom';
import dnd5eSystemID from './systems/dnd5e/systemID';
import dnd5eTraitArrayWithCustom from './systems/dnd5e/traitArrayWithCustom';
import pf1SystemID from './systems/pf1/systemID';
import pf1TraitArrayWithCustom from './systems/pf1/traitArrayWithCustom';

export const supportedSystems = [d35eSystemID, dnd5eSystemID, pf1SystemID];

export default [
  d35eTraitArrayWithCustom('conditionImmunities', 'ci', 'CondType'),
  dnd5eTraitArrayWithCustom('conditionImmunities', 'ci', 'Con'),
  pf1TraitArrayWithCustom('conditionImmunities', 'ci'),
] satisfies AttributeLookup[];

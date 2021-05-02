import d35eTraitArrayWithCustom from './d35e/traitArrayWithCustom.js';
import dnd5eTraitArrayWithCustom from './dnd5e/traitArrayWithCustom.js';
import pf1TraitArrayWithCustom from './pf1/traitArrayWithCustom.js';

export default [
  d35eTraitArrayWithCustom('conditionImmunities', 'ci', 'CondType'),
  dnd5eTraitArrayWithCustom('conditionImmunities', 'ci', 'Con'),
  pf1TraitArrayWithCustom('conditionImmunities', 'ci'),
];

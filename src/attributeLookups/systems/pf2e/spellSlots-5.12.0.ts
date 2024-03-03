import module from '../../../module';
import calculateValue from '../../../tooltip/calculateValue';
import { AsyncRow } from '../../AttributeLookup';
import spellIcon from '../../spellSlots/spellIcon';

const getSpellcastingEntries = (actor: pf2e.internal.actor.ActorPF2e): pf2e.internal.item.spellcastingEntry.SpellcastingEntryPF2e[] => {
  const entries: {
    sort: number
    spellcastingEntry: pf2e.internal.item.spellcastingEntry.SpellcastingEntryPF2e
  }[] = [];
  for (const item of actor.items) {
    if (item.type === 'spellcastingEntry') {
      const spellcastingEntry = actor.spellcasting.get(item.id);
      if (spellcastingEntry) {
        entries.push({
          sort: item.sort || 0,
          spellcastingEntry,
        });
      }
    }
  }
  entries.sort((a, b) => a.sort - b.sort);
  return entries.map((entry) => entry.spellcastingEntry);
};

const getFocusEntry = (actor: pf2e.internal.actor.ActorPF2e): AsyncRow => {
  const label = game.i18n.localize('illandril-token-tooltips.focusAbbreviation');
  return {
    label,
    icon: spellIcon(label),
    value: calculateValue(foundry.utils.getProperty(actor.system, 'resources.focus')),
  };
};

const getGroupEntry = (group: pf2e.internal.item.spellcastingEntry.SpellcastingSlotGroup): AsyncRow | null => {
  if (group.uses && group.uses.value !== undefined && group.uses.max > 0) {
    let label;
    if (group.id === 'cantrips') {
      label = game.i18n.localize('illandril-token-tooltips.cantripAbbreviation');
    } else {
      label = `${group.id}`;
    }
    return {
      icon: spellIcon(label),
      label,
      value: calculateValue(group.uses),
    };
  }
  return null;
};

export default async (baseActor: Actor) => {
  const actor = baseActor as pf2e.internal.actor.ActorPF2e;
  module.logger.debug('pf2e spell slots', actor.name, actor);
  if (!actor.spellcasting) {
    module.logger.debug('pf2e spell slots: actor has no spellcasting', actor.name);
    return [];
  }
  module.logger.debug('pf2e spell slots: spellcasting', actor.spellcasting);

  const slots: AsyncRow[] = [];
  const spellcastingEntries = getSpellcastingEntries(actor);
  let hasFocus = false;
  for (const entry of spellcastingEntries) {
    module.logger.debug('pf2e spell slots: spellcasting entry', entry);
    if (entry.isFocusPool) {
      if (!hasFocus) {
        hasFocus = true;
        slots.push(getFocusEntry(actor));
      }
      continue;
    }
    if (entry.getSheetData) {
      // We want the rows to be in order, including the focus entry, and awaiting on an entry
      // in a loop is an acceptable performance risk. Chances are high that the user will have
      // only one or two spellcasting entries, so most will never notice the added delay
      // eslint-disable-next-line no-await-in-loop
      const spellData = await entry.getSheetData();
      for (const group of spellData.groups) {
        module.logger.debug('pf2e spell slots: spell group', group);
        const levelEntry = getGroupEntry(group);
        if (levelEntry) {
          slots.push(levelEntry);
        }
      }
    }
  }
  return slots;
};

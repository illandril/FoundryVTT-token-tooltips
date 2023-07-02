import filterEmpty from '../dataConversion/filterEmpty';
import img from '../html/img';

type MaybeTalent = {
  itemId?: string
  name?: string
};

type TalentDefinition = {
  name: string
  icon: string | HTMLImageElement
  value: string
};

export const get = (actor: Actor): TalentDefinition[] => {
  const talents = foundry.utils.getProperty(actor.system, 'talentList');
  if (!talents || !Array.isArray(talents)) {
    return [];
  }
  return (talents as MaybeTalent[]).map((talent) => {
    if (!talent || typeof talent !== 'object') {
      return null;
    }
    if (typeof talent.itemId !== 'string' || typeof talent.name !== 'string') {
      return null;
    }
    const item = actor.items.get(talent.itemId);
    const icon = img(item?.img) || 'star';
    return {
      name: talent.name,
      icon,
      value: talent.name,
    };
  }).filter(filterEmpty);
};

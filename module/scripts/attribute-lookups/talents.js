import { img } from '../ui/html.js';

export const get = (actor) => {
  const talents = getProperty(actor, 'data.data.talentList');
  if (!talents) {
    return [];
  }
  return talents.map((talent) => {
    const item = actor.items.get(talent.itemId);
    const icon = (item && img(item.data.img)) || 'star';
    return {
      name: talent.name,
      icon,
      value: talent.name,
    };
  });
};

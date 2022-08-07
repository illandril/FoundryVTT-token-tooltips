import { img } from '../ui/html.js';

export const get = (actor) => {
  const talents = getProperty(actor.system, 'talentList');
  if (!talents) {
    return [];
  }
  return talents.map((talent) => {
    const item = actor.items.get(talent.itemId);
    const icon = (item && img(item.img)) || 'star';
    return {
      name: talent.name,
      icon,
      value: talent.name,
    };
  });
};

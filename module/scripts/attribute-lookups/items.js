import { shouldCalculateUses, calculateUses } from '../item-system.js';
import { img } from '../ui/html.js';

const itemSort = (a, b) => {
  return a.sort - b.sort;
};

export const get = (actor) => {
  const items = actor.items;
  const fArr = [];
  const cArr = [];
  items &&
    items.forEach((item) => {
      if (shouldCalculateUses(item)) {
        const { uses, maxUses } = calculateUses(item);
        if (uses !== null) {
          (item.type === 'feat' ? fArr : cArr).push({
            name: item.name,
            icon: img(item.img),
            sort: item.sort,
            value: {
              value: uses,
              max: maxUses,
            },
          });
        }
      }
    });
  fArr.sort(itemSort);
  cArr.sort(itemSort);
  return fArr.concat(cArr);
};

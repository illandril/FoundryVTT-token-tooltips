import { showInTooltip, calculateUses } from '../actorSettings/ItemSystem';
import img from '../html/img';
import { CalculatedValue } from '../tooltip/calculateValue';

type ItemAttribute = {
  name: string
  icon: HTMLImageElement | null
  sort: number
  value: CalculatedValue
};
const itemSort = (a: ItemAttribute, b: ItemAttribute) => {
  return a.sort - b.sort;
};

export const get = (actor: Actor) => {
  const items = actor.items;
  const fArr: ItemAttribute[] = [];
  const cArr: ItemAttribute[] = [];
  items.forEach((item) => {
    if (showInTooltip(item)) {
      const calculatedUses = calculateUses(item);
      if (!calculatedUses) {
        return;
      }
      if (calculatedUses.uses !== null) {
        (item.type === 'feat' ? fArr : cArr).push({
          name: item.name,
          icon: img(item.img),
          sort: item.sort,
          value: {
            value: calculatedUses.uses,
            max: calculatedUses.maxUses,
          },
        });
      }
    }
  });
  fArr.sort(itemSort);
  cArr.sort(itemSort);
  return fArr.concat(cArr);
};

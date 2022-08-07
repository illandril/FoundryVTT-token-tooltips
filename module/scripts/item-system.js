const SHOW_ITEM_SETTING = 'system.illandril.tooltips.show';

export const showInTooltip = (itemData) => {
  return itemData && !!getProperty(itemData, SHOW_ITEM_SETTING);
};

export const setShowInTooltip = (itemEntity, show) => {
  const updates = {};
  updates[SHOW_ITEM_SETTING] = show;
  itemEntity.update(updates);
};

export const canCalculateUses = (item) => {
  if (item.type === 'consumable') {
    return true;
  }
  const itemData = item.system;
  return (itemData.uses && itemData.uses.max) || itemData.quantity;
};

export const shouldCalculateUses = (item) => {
  if (!showInTooltip(item)) {
    return false;
  }
  return canCalculateUses(item);
};

export const calculateUses = (item) => {
  const itemData = item.system;
  let uses = 1;
  let maxUses = 0;
  const itemUses = itemData.uses;
  let showMaxUses = false;
  if (itemUses && itemUses.max) {
    uses = itemUses.value;
    maxUses = itemUses.max;
    if(maxUses > 1) {
      showMaxUses = true;
    } else if(maxUses === 1) {
      showMaxUses = !itemUses.autoDestroy
    }
  }
  const quantity = itemData.quantity;
  if (quantity) {
    uses += (quantity - 1) * Math.max(1, maxUses);
    maxUses = maxUses * quantity;
  }
  return { uses, maxUses: showMaxUses ? maxUses : null };
};

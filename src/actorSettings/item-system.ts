import nanToZero from '../dataConversion/nanToZero';

export const showInTooltip = (item: Item) => {
  const flag = item.getFlag('illandril-token-tooltips', 'show');
  return typeof flag === 'boolean' ? flag : false;
};

export const setShowInTooltip = (item: Item, show: boolean) => {
  item.setFlag('illandril-token-tooltips', 'show', show);
};

export const canCalculateUses = (item: Item) => {
  return calculateUses(item) !== null;
};

const extractNumber = (value: unknown) => {
  if (typeof value === 'number' || typeof value === 'string') {
    return nanToZero(value);
  }
  return 0;
};

type PotentialUsesSystem = {
  quantity?: unknown;
  uses?: {
    value?: unknown;
    max?: unknown;
    autoDestroy?: unknown;
  };
};

export const calculateUses = (item: Item) => {
  const system = item.system as PotentialUsesSystem;
  if (!system) {
    return null;
  }
  const quantity = extractNumber(system.quantity);
  if (!system.uses?.max) {
    return quantity > 0 ? { uses: quantity } : null;
  }

  let uses = extractNumber(system.uses.value);
  let maxUses = extractNumber(system.uses.max);
  const showMaxUses = maxUses > 1 || system?.uses?.autoDestroy !== true;

  if (quantity > 0) {
    uses += (quantity - 1) * Math.max(1, maxUses);
    maxUses = maxUses * quantity;
  }
  if (uses > 0 || (showMaxUses && maxUses > 0)) {
    return {
      uses,
      maxUses: showMaxUses ? maxUses : null,
    };
  }
  return null;
};

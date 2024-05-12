import Tooltip from '../tooltip/Tooltip';
import lookup from './lookup';
import type { PersistentTooltipOption } from './types';

let previousTooltips: Tooltip[];

const getCommonTooltipConfig = (setting: PersistentTooltipOption) => {
  return {
    position: setting.position,
  };
};

const render = (settings: PersistentTooltipOption[]) => {
  if (previousTooltips?.length) {
    for (const previousTooltip of previousTooltips) {
      previousTooltip.destroy();
    }
  }
  previousTooltips = [];

  for (const setting of settings) {
    const args = lookup(setting);
    if (args) {
      previousTooltips.push(
        new Tooltip({
          ...args,
          ...getCommonTooltipConfig(setting),
        }),
      );
    }
  }
};

export default render;

import icon from '../html/icon';
import module from '../module';
import { HIDE_FROM_EVERYONE_OPTION } from '../settings/SpecialPermissions';
import { Items } from '../settings/StandardOptions';
import './Actor5e.scss';
import * as CSS from './CSS';
import { canCalculateUses, showInTooltip, setShowInTooltip } from './ItemSystem';

const CSS5E_ITEM_DETAIL = 'item-detail';

Hooks.on('renderActorSheet5eCharacter', (actorSheet, html) => {
  if (Items.permission.get() === HIDE_FROM_EVERYONE_OPTION) {
    return;
  }
  const actor = actorSheet.actor;
  if (!actor.isOwner) {
    return;
  }

  const sheetElem = html[0];

  addTogglesToInventoryTab(sheetElem, '.tab.inventory', actor);
  addTogglesToInventoryTab(sheetElem, '.tab.features', actor);
});

const addTogglesToInventoryTab = (sheetElem: HTMLElement, tabSelector: string, actor: Actor) => {
  const inventoryTab = sheetElem.querySelector(tabSelector);
  if (!inventoryTab) {
    module.logger.error('Could not find inventory tab', tabSelector);
    return;
  }
  const inventoryHeaders = inventoryTab.querySelectorAll('.items-header');
  if (inventoryHeaders?.length > 0) {
    addTooltipToggleHeaders(inventoryHeaders);
  } else {
    module.logger.error('Could not find inventory headers', tabSelector);
  }

  addTooltipToggleCells(inventoryTab.querySelectorAll('.item[data-item-id]'), actor);
};

const addTooltipToggleHeaders = (inventoryHeaders: NodeListOf<Element>) => {
  Array.prototype.forEach.call(inventoryHeaders, (inventoryHeader: Element) => {
    const tooltipHeader = document.createElement('div');
    tooltipHeader.classList.add(CSS5E_ITEM_DETAIL);
    tooltipHeader.classList.add(CSS.TOOLTIP_CELL);

    const itemControlsHeader = inventoryHeader.querySelector('.item-controls');
    inventoryHeader.insertBefore(tooltipHeader, itemControlsHeader);
  });
};

const addTooltipToggleCells = (inventoryRows: NodeListOf<Element>, actor: Actor) => {
  Array.prototype.forEach.call(inventoryRows, (inventoryRow: Element) => {
    const item = getItemForRow(inventoryRow, actor);
    if (!item) {
      module.logger.error('Could not find item for row', inventoryRow, actor);
    } else {
      const tooltipCell = document.createElement('div');
      tooltipCell.classList.add(CSS5E_ITEM_DETAIL);
      tooltipCell.classList.add(CSS.TOOLTIP_CELL);

      addTooltipToggle(tooltipCell, item);

      const itemControlsCell = inventoryRow.querySelector('.item-controls');
      inventoryRow.insertBefore(tooltipCell, itemControlsCell);
    }
  });
};

const getItemForRow = (inventoryRow: Element, actor: Actor) => {
  const itemID = inventoryRow.getAttribute('data-item-id');
  return itemID === null ? undefined : actor.items.get(itemID);
};

const addTooltipToggle = (tooltipCell: Element, item: Item) => {
  if (canCalculateUses(item)) {
    const shown = showInTooltip(item);

    const tooltipToggle = document.createElement('a');
    tooltipToggle.classList.add(CSS.TOOLTIP_TOGGLE);
    tooltipToggle.setAttribute('role', 'switch');
    tooltipToggle.setAttribute('aria-checked', shown ? 'true' : 'false');

    const ariaLabel = module.localize('tooltipSwitch');
    tooltipToggle.setAttribute('aria-label', ariaLabel);

    const titleKey = `tooltip${shown ? '' : 'Not'}Shown`;
    tooltipToggle.title = module.localize(titleKey);
    tooltipToggle.addEventListener('click', () => setShowInTooltip(item, !shown), false);
    tooltipToggle.appendChild(icon('hand-pointer'));

    tooltipCell.appendChild(tooltipToggle);
  }
};

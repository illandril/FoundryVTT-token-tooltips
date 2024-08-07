import icon from '../html/icon';
import module from '../module';
import { HIDE_FROM_EVERYONE_OPTION } from '../settings/special-permissions';
import { Items } from '../settings/standard-options';
import './dnd5eActor5e.scss';
import { canCalculateUses, setShowInTooltip, showInTooltip } from './item-system';

const cssPrefix = module.cssPrefix.childPrefix('actorSettings');

const CSS_TOOLTIP_CELL = cssPrefix.child('tooltipToggleCell');
const CSS_TOOLTIP_TOGGLE = cssPrefix.child('tooltipToggle');

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
  try {
    Array.prototype.forEach.call(inventoryHeaders, (inventoryHeader: Element) => {
      const tooltipHeader = document.createElement('div');
      tooltipHeader.classList.add(CSS5E_ITEM_DETAIL);
      tooltipHeader.classList.add(CSS_TOOLTIP_CELL);

      const itemControlsHeader = inventoryHeader.querySelector('.item-controls');
      itemControlsHeader?.parentElement?.insertBefore(tooltipHeader, itemControlsHeader);
    });
  } catch (error) {
    module.logger.error('Error adding tooltip toggle headers', inventoryHeaders, error);
  }
};

const addTooltipToggleCells = (inventoryRows: NodeListOf<Element>, actor: Actor) => {
  try {
    Array.prototype.forEach.call(inventoryRows, (inventoryRow: Element) => {
      const item = getItemForRow(inventoryRow, actor);
      if (!item) {
        module.logger.error('Could not find item for row', inventoryRow, actor);
      } else {
        const tooltipCell = document.createElement('div');
        tooltipCell.classList.add(CSS5E_ITEM_DETAIL);
        tooltipCell.classList.add(CSS_TOOLTIP_CELL);

        addTooltipToggle(tooltipCell, item);

        const itemControlsCell = inventoryRow.querySelector('.item-controls');
        itemControlsCell?.parentElement?.insertBefore(tooltipCell, itemControlsCell);
      }
    });
  } catch (error) {
    module.logger.error('Error adding tooltip toggle cells', error, inventoryRows);
  }
};

const getItemForRow = (inventoryRow: Element, actor: Actor) => {
  const itemID = inventoryRow.getAttribute('data-item-id');
  return itemID === null ? undefined : actor.items.get(itemID);
};

const addTooltipToggle = (tooltipCell: Element, item: Item) => {
  if (canCalculateUses(item)) {
    const shown = showInTooltip(item);

    const tooltipToggle = document.createElement('a');
    tooltipToggle.classList.add(CSS_TOOLTIP_TOGGLE);
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

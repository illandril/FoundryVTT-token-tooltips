import Settings from '../settings/index.js';
import { CSS_PREFIX } from '../module.js';
import { icon } from './html.js';
import { canCalculateUses, showInTooltip, setShowInTooltip } from '../item-system.js';

const CSS5E_ITEM_DETAIL = 'item-detail';
const CSS_TOOLTIP_CELL = CSS_PREFIX + 'tooltip-cell';
const CSS_TOOLTIP_TOGGLE = CSS_PREFIX + 'toggle';
const CSS_TOOLTIP_ACTIVE = CSS_PREFIX + 'active';

Hooks.on('renderActorSheet5eCharacter', (actorSheet, html, data) => {
  const actor = game.actors.get(data.actor._id);
  if (!actor.isOwner) {
    return;
  }

  const sheetElem = html[0];

  addTogglesToInventoryTab(sheetElem.querySelector('.tab.inventory'), actor);
  addTogglesToInventoryTab(sheetElem.querySelector('.tab.features'), actor);
});

const addTogglesToInventoryTab = (inventoryTab, actor) => {
  addTooltipToggleHeaders(inventoryTab.querySelectorAll('.inventory-header'));
  addTooltipToggleCells(inventoryTab.querySelectorAll('.item[data-item-id]'), actor);
};

const addTooltipToggleHeaders = (inventoryHeaders) => {
  Array.prototype.forEach.call(inventoryHeaders, (inventoryHeader) => {
    const tooltipHeader = document.createElement('div');
    tooltipHeader.classList.add(CSS5E_ITEM_DETAIL);
    tooltipHeader.classList.add(CSS_TOOLTIP_CELL);

    const itemControlsHeader = inventoryHeader.querySelector('.item-controls');
    inventoryHeader.insertBefore(tooltipHeader, itemControlsHeader);
  });
};

const addTooltipToggleCells = (inventoryRows, actor) => {
  Array.prototype.forEach.call(inventoryRows, (inventoryRow) => {
    const tooltipCell = document.createElement('div');
    tooltipCell.classList.add(CSS5E_ITEM_DETAIL);
    tooltipCell.classList.add(CSS_TOOLTIP_CELL);

    addTooltipToggle(tooltipCell, getItemForRow(inventoryRow, actor));

    const itemControlsCell = inventoryRow.querySelector('.item-controls');
    inventoryRow.insertBefore(tooltipCell, itemControlsCell);
  });
};

const getItemForRow = (inventoryRow, actor) => {
  const itemID = inventoryRow.getAttribute('data-item-id');
  return actor.items.get(itemID);
};

const addTooltipToggle = (tooltipCell, item) => {
  if (canCalculateUses(item)) {
    const shown = showInTooltip(item);
    const tooltipToggle = document.createElement('a');
    tooltipToggle.classList.add(CSS_TOOLTIP_TOGGLE);
    tooltipToggle.setAttribute('role', 'switch');
    tooltipToggle.setAttribute('aria-checked', shown);
    const ariaLabel = game.i18n.localize('illandril-token-tooltips.tooltipSwitch');
    tooltipToggle.setAttribute('aria-label', ariaLabel);
    if (shown) {
      tooltipToggle.classList.add(CSS_TOOLTIP_ACTIVE);
    }
    const titleKey = 'illandril-token-tooltips.tooltip' + (shown ? 'Shown' : 'NotShown');
    tooltipToggle.title = game.i18n.localize(titleKey);
    tooltipToggle.addEventListener('click', () => setShowInTooltip(item, !shown), false);
    tooltipToggle.appendChild(icon('hand-pointer'));
    tooltipCell.appendChild(tooltipToggle);
  }
};

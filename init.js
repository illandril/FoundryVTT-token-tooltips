const CSS_PREFIX = 'illandril-token-tooltips--';
const CSS_TOOLTIP = CSS_PREFIX + 'tooltip';
const CSS_NAME = CSS_PREFIX + 'name';
const CSS_DATA = CSS_PREFIX + 'data';
const CSS_SHOW = CSS_PREFIX + 'show';
const CSS_SPELLSLOT = CSS_PREFIX + 'spellslot';
const CSS_SPELLSLOT_LEVEL = CSS_PREFIX + 'spellslot-level';
const CSS_ROW = CSS_PREFIX + 'row';
const CSS_LABEL = CSS_PREFIX + 'label';
const CSS_VALUE = CSS_PREFIX + 'value';
const CSS_CURRENT = CSS_PREFIX + 'current';
const CSS_MAX = CSS_PREFIX + 'max';
const CSS_TEMP = CSS_PREFIX + 'temp';

const CSS5E_ITEM_DETAIL = 'item-detail';
const CSS_TOOLTIP_CELL = CSS_PREFIX + 'tooltip-cell';
const CSS_TOOLTIP_TOGGLE = CSS_PREFIX + 'toggle';
const CSS_TOOLTIP_ACTIVE = CSS_PREFIX + 'active';

const tooltipElem = document.createElement('div');
tooltipElem.classList.add(CSS_TOOLTIP);

const tooltipName = document.createElement('div');
tooltipName.classList.add(CSS_NAME);
tooltipElem.appendChild(tooltipName);

const tooltipDataContainer = document.createElement('div');
tooltipDataContainer.classList.add(CSS_DATA);
tooltipElem.appendChild(tooltipDataContainer);

Hooks.once('ready', () => {
  // Workaround for the hover spam issue: https://gitlab.com/foundrynet/foundryvtt/-/issues/3506
  canvas.app.renderer.plugins.interaction.moveWhenInside = true;
});

Hooks.on('renderActorSheet5eCharacter', (actorSheet, html, data) => {
  const actor = game.actors.get(data.actor._id);
  if (actor.permission !== ENTITY_PERMISSIONS.OWNER) {
    return;
  }

  const inventoryTab = html[0].querySelector('.tab.inventory');
  const inventoryHeaders = inventoryTab.querySelectorAll('.inventory-header');
  Array.prototype.forEach.call(inventoryHeaders, (inventoryHeader) => {
    const tooltipHeader = document.createElement('div');
    tooltipHeader.classList.add(CSS5E_ITEM_DETAIL);
    tooltipHeader.classList.add(CSS_TOOLTIP_CELL);
    inventoryHeader.insertBefore(tooltipHeader, inventoryHeader.querySelector('.item-controls'));
  });

  const inventoryRows = inventoryTab.querySelectorAll('.item[data-item-id]');
  Array.prototype.forEach.call(inventoryRows, (inventoryRow) => {
    const itemID = inventoryRow.getAttribute('data-item-id');
    const item = actor.items.get(itemID);
    const tooltipCell = document.createElement('div');
    tooltipCell.classList.add(CSS5E_ITEM_DETAIL);
    tooltipCell.classList.add(CSS_TOOLTIP_CELL);

    if (canCalculateAsConsumable(item.data)) {
      const shown = !!getProperty(item.data, 'data.illandril.tooltips.show');
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
      tooltipToggle.addEventListener(
        'click',
        () => {
          item.update({ 'data.illandril.tooltips.show': !shown });
        },
        false
      );
      tooltipToggle.appendChild(faIcon('hand-pointer'));
      tooltipCell.appendChild(tooltipToggle);
    }
    inventoryRow.insertBefore(tooltipCell, inventoryRow.querySelector('.item-controls'));
  });
});

Hooks.once('ready', () => {
  document.body.appendChild(tooltipElem);
  window.addEventListener('mousedown', () => {
    tooltipElem.classList.remove(CSS_SHOW);
  });
});

Hooks.on('hoverToken', (token, hovered) => {
  if (hovered && shouldShowTooltip(token)) {
    const actor = token.actor;
    const attributes = actor.data.data.attributes;
    const skills = actor.data.data.skills;
    const spells = actor.data.data.spells;
    const items = actor.data.items;
    const hp = attributes.hp;

    const aArr = [];
    const ssArr = [];
    const fArr = [];
    const cArr = [];
    showAttribute(aArr, aArr.length, 'HP', faIcon('heart'), hp.value, hp.max, hp.temp, hp.tempmax);

    showAttribute(
      aArr,
      aArr.length,
      game.i18n.localize('DND5E.ArmorClass'),
      faIcon('user-shield'),
      attributes.ac.value
    );
    showPassive(aArr, game.i18n.localize('DND5E.SkillPrc'), faIcon('eye'), skills.prc);
    showPassive(aArr, game.i18n.localize('DND5E.SkillInv'), faIcon('search'), skills.inv);
    showPassive(aArr, game.i18n.localize('DND5E.SkillIns'), faIcon('brain'), skills.ins);

    showSpellSlot(ssArr, 'P', spells.pact);
    showSpellSlot(ssArr, '1', spells.spell1);
    showSpellSlot(ssArr, '2', spells.spell2);
    showSpellSlot(ssArr, '3', spells.spell3);
    showSpellSlot(ssArr, '4', spells.spell4);
    showSpellSlot(ssArr, '5', spells.spell5);
    showSpellSlot(ssArr, '6', spells.spell6);
    showSpellSlot(ssArr, '7', spells.spell7);
    showSpellSlot(ssArr, '8', spells.spell8);
    showSpellSlot(ssArr, '9', spells.spell9);
    items.forEach((item) => {
      if (item.type === 'feat' && item.data.uses && item.data.uses.max > 0) {
        const uses = item.data.uses;
        showAttribute(fArr, item.sort, item.name, img(item.img), uses.value, uses.max);
      }
      if (shouldCalculateAsConsumable(item)) {
        const { uses, maxUses } = calculateConsumableUses(item);
        if (uses !== null) {
          showAttribute(cArr, item.sort, item.name, img(item.img), uses, maxUses);
        }
      }
    });

    emptyNode(tooltipName);
    emptyNode(tooltipDataContainer);
    tooltipName.appendChild(document.createTextNode(token.name));
    sortAndAdd(tooltipDataContainer, aArr);
    sortAndAdd(tooltipDataContainer, ssArr);
    sortAndAdd(tooltipDataContainer, fArr);
    sortAndAdd(tooltipDataContainer, cArr);

    const tokenWidth = token.w * canvas.stage.scale.x;

    tooltipElem.style.left = Math.ceil(token.worldTransform.tx + tokenWidth + 8) + 'px';
    tooltipElem.style.top = Math.floor(token.worldTransform.ty - 8) + 'px';
    tooltipElem.classList.add(CSS_SHOW);
  } else {
    tooltipElem.classList.remove(CSS_SHOW);
  }
});

function sortAndAdd(tooltipDataContainer, attributeArray) {
  attributeArray.sort(attributeSort);
  attributeArray.forEach((attr) => {
    tooltipDataContainer.appendChild(attr.element);
  });
}

function attributeSort(a, b) {
  return a.sort - b.sort;
}

function shouldCalculateAsConsumable(item) {
  if (!getProperty(item, 'data.illandril.tooltips.show')) {
    return false;
  }
  return canCalculateAsConsumable(item);
}

function canCalculateAsConsumable(item) {
  if (item.type === 'consumable') {
    return true;
  }
  if (item.data.uses && item.data.uses.max) {
    return true;
  }
  if (item.data.quantity) {
    return true;
  }
  return false;
}

function calculateConsumableUses(item) {
  const itemData = item.data;
  let uses = 1;
  let maxUses = 0;
  if (itemData.uses && itemData.uses.max) {
    uses = itemData.uses.value;
    maxUses = itemData.uses.max;
  }
  const quantity = itemData.quantity;
  if (quantity) {
    uses += (quantity - 1) * Math.max(1, maxUses);
    maxUses = maxUses * quantity;
  }
  return { uses, maxUses: maxUses > quantity ? maxUses : null };
}

function shouldShowTooltip(token) {
  if (!(token && token.actor)) {
    return false;
  }
  if (game.user.isGM) {
    return true;
  }
  return token.data.disposition === TOKEN_DISPOSITIONS.FRIENDLY;
}

function showSpellSlot(ssArr, level, slots) {
  if (slots.max > 0 && slots.max < 99) {
    const slotIcon = document.createElement('span');
    slotIcon.classList.add(CSS_SPELLSLOT);
    slotIcon.appendChild(faIcon('star'));
    const slotLevelDisp = document.createElement('span');
    slotLevelDisp.classList.add(CSS_SPELLSLOT_LEVEL);
    let name;
    if (level === 'P') {
      name = game.i18n.localize('DND5E.PactMagic');
      const pactAbbr = game.i18n.localize('illandril-token-tooltips.pactAbbreviation');
      slotLevelDisp.appendChild(document.createTextNode(pactAbbr));
    } else {
      name = game.i18n.localize('DND5E.SpellLevel' + level);
      slotLevelDisp.appendChild(document.createTextNode(level));
    }
    slotIcon.appendChild(slotLevelDisp);

    showAttribute(ssArr, ssArr.length, name, slotIcon, slots.value, slots.max);
  }
}

function showPassive(aArr, name, icon, skill) {
  showAttribute(
    aArr,
    aArr.length,
    name + ' (' + game.i18n.localize('DND5E.Passive') + ')',
    icon,
    skill.passive
  );
}

function showAttribute(aArr, sort, name, icon, value, max = null, temp = null, tempMax = null) {
  const row = document.createElement('div');
  row.classList.add(CSS_ROW);

  const label = document.createElement('span');
  label.classList.add(CSS_LABEL);
  if (icon) {
    label.appendChild(icon);
    label.title = name;
  } else {
    label.appendChild(document.createTextNode(name));
  }
  row.appendChild(label);

  const valueDisplay = document.createElement('span');
  valueDisplay.classList.add(CSS_VALUE);

  const currDisplay = document.createElement('span');
  currDisplay.classList.add(CSS_CURRENT);
  if (!!temp) {
    currDisplay.classList.add(CSS_TEMP);
    const valueWTemp = '' + (parseInt(value, 10) + parseInt(temp, 10));
    currDisplay.appendChild(document.createTextNode(valueWTemp));
  } else {
    currDisplay.appendChild(document.createTextNode(value));
  }
  valueDisplay.appendChild(currDisplay);

  if (max !== null) {
    const maxDisplay = document.createElement('span');
    maxDisplay.classList.add(CSS_MAX);
    if (!!tempMax) {
      maxDisplay.classList.add(CSS_TEMP);
      const maxWTemp = '' + (parseInt(max, 10) + parseInt(tempMax, 10));
      maxDisplay.appendChild(document.createTextNode(maxWTemp));
    } else {
      maxDisplay.appendChild(document.createTextNode(max));
    }
    valueDisplay.appendChild(maxDisplay);
  }
  row.appendChild(valueDisplay);
  aArr.push({
    sort,
    element: row,
  });
}

function img(url) {
  if (url) {
    const img = document.createElement('img');
    img.src = url;
    img.alt = '';
    return img;
  }
  return null;
}

function faIcon(iconName) {
  const iconElem = document.createElement('i');
  iconElem.classList.add('fas');
  iconElem.classList.add('fa-' + iconName);
  return iconElem;
}

function emptyNode(node) {
  while (node.firstChild) {
    node.removeChild(node.lastChild);
  }
}

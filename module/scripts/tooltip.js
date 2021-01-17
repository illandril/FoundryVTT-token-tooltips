import Settings, { HIDE_FROM_EVERYONE_OPTION } from './settings.js';
import { CSS_PREFIX } from './module.js';
import { icon, emptyNode, img, div, span, appendText } from './html.js';
import { shouldCalculateUses, calculateUses } from './item-system.js';

const CSS_TOOLTIP = `${CSS_PREFIX}tooltip`;
const CSS_NAME = `${CSS_PREFIX}name`;
const CSS_DATA = `${CSS_PREFIX}data`;
const CSS_SHOW = `${CSS_PREFIX}show`;
const CSS_RESOURCE = `${CSS_PREFIX}resource`;
const CSS_RESOURCE_NUMBER = `${CSS_PREFIX}resource-number`;
const CSS_SPELLSLOT = `${CSS_PREFIX}spellslot`;
const CSS_SPELLSLOT_LEVEL = `${CSS_PREFIX}spellslot-level`;
const CSS_ROW = `${CSS_PREFIX}row`;
const CSS_LABEL = `${CSS_PREFIX}label`;
const CSS_VALUE = `${CSS_PREFIX}value`;
const CSS_CURRENT = `${CSS_PREFIX}current`;
const CSS_MAX = `${CSS_PREFIX}max`;
const CSS_TEMP = `${CSS_PREFIX}temp`;

const passiveSkillLabel = (skill) => {
  return (
    game.i18n.localize(`DND5E.Skill${skill}`) + ' (' + game.i18n.localize('DND5E.Passive') + ')'
  );
};

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const MOVEMENTS = [
  { name: 'walk', icon: 'walking' },
  { name: 'burrow', icon: 'angle-double-down' },
  { name: 'climb', icon: 'spider' },
  { name: 'fly', icon: 'feather-alt' },
  { name: 'swim', icon: 'swimmer' },
];

const resourceType = (resourceNumber) => {
  switch (resourceNumber) {
    case 1:
      return 'primary';
    case 2:
      return 'secondary';
    case 3:
      return 'tertiary';
    default:
      return 'UNKNOWN';
  }
};

const resourceRow = (resourceNumber) => {
  const slotIcon = span(CSS_RESOURCE);
  slotIcon.appendChild(icon('circle'));
  const slotNumberDisp = span(CSS_RESOURCE_NUMBER);
  const name = game.i18n.localize(`DND5E.Resource${capitalize(resourceType(resourceNumber))}`);
  appendText(slotNumberDisp, resourceNumber);
  slotIcon.appendChild(slotNumberDisp);
  return new AttributeRow(name, slotIcon);
};

const spellSlotRow = (level) => {
  const slotIcon = span(CSS_SPELLSLOT);
  slotIcon.appendChild(icon('star'));
  const slotLevelDisp = span(CSS_SPELLSLOT_LEVEL);
  let name;
  if (level === 'P') {
    name = game.i18n.localize('DND5E.PactMagic');
    const pactAbbr = game.i18n.localize('illandril-token-tooltips.pactAbbreviation');
    appendText(slotLevelDisp, pactAbbr);
  } else {
    name = game.i18n.localize(`DND5E.SpellLevel${level}`);
    appendText(slotLevelDisp, level);
  }
  slotIcon.appendChild(slotLevelDisp);
  return new AttributeRow(name, slotIcon);
};

class Tooltip {
  constructor() {
    this.element = div(CSS_TOOLTIP);

    this.nameElement = div(CSS_NAME);
    this.element.appendChild(this.nameElement);

    this.dataElement = div(CSS_DATA);
    this.element.appendChild(this.dataElement);

    this.hpRow = new AttributeRow(game.i18n.localize('DND5E.HitPoints'), icon('heart'));
    this.acRow = new AttributeRow(game.i18n.localize('DND5E.ArmorClass'), icon('user-shield'));
    this.psvPrcRow = new AttributeRow(passiveSkillLabel('Prc'), icon('eye'));
    this.psvInvRow = new AttributeRow(passiveSkillLabel('Inv'), icon('search'));
    this.psvInsRow = new AttributeRow(passiveSkillLabel('Ins'), icon('brain'));

    this.movementRows = [];
    MOVEMENTS.forEach((movementType) => {
      this.movementRows.push(
        new AttributeRow(
          game.i18n.localize(`DND5E.Movement${capitalize(movementType.name)}`),
          icon(movementType.icon)
        )
      );
    });
    this.r1Row = resourceRow(1);
    this.r2Row = resourceRow(2);
    this.r3Row = resourceRow(3);

    this.spellRows = [spellSlotRow('P')];
    for (let i = 1; i <= 9; i++) {
      this.spellRows.push(spellSlotRow(i));
    }

    document.body.appendChild(this.element);
    window.addEventListener('mousedown', () => {
      this.element.classList.remove(CSS_SHOW);
    });

    Hooks.on('hoverToken', (token, hovered) => {
      this.onHover(token, hovered);
    });
  }

  onHover(token, hovered) {
    if (hovered && shouldShowTooltip(token)) {
      this.updateData(token);
      this.fixPosition(token);
      this.show();
    } else {
      this.hide();
    }
  }

  fixPosition(token) {
    const tokenWidth = token.w * canvas.stage.scale.x;
    const left = Math.ceil(token.worldTransform.tx + tokenWidth + 8);
    const top = Math.floor(token.worldTransform.ty - 8);
    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
  }

  show() {
    this.element.classList.add(CSS_SHOW);
  }

  hide() {
    this.element.classList.remove(CSS_SHOW);
  }

  updateData(token) {
    this.clearElements();

    this.updateName(token);

    const actor = token.actor;
    this.updateHPAndAC(actor);
    this.updateMovement(actor);
    this.updatePassives(actor);
    this.updateResources(actor);
    this.updateSpellSlots(actor);
    this.updateItems(actor);
  }

  clearElements() {
    emptyNode(this.nameElement);
    emptyNode(this.dataElement);
  }

  updateName(token) {
    this.nameElement.appendChild(document.createTextNode(token.name));
  }

  updateHPAndAC(actor) {
    const attributes = actor.data.data.attributes;
    const hp = attributes.hp;
    if (hp) {
      this.hpRow.setValue(hp.value, hp.max, hp.temp, hp.tempmax);
      this.dataElement.appendChild(this.hpRow.element);
    }
    if (attributes.ac) {
      this.acRow.setValue(attributes.ac.value);
      this.dataElement.appendChild(this.acRow.element);
    }
  }

  updateMovement(actor) {
    if (showDataType(actor, Settings.MovementMinimumPermission)) {
      const movements = actor.data.data.attributes.movement || {};
      MOVEMENTS.forEach((movementType, i) => {
        const movementRow = this.movementRows[i];
        const movement = movements[movementType.name] || 0;
        if (movement > 0) {
          movementRow.setValue(movement);
          this.dataElement.appendChild(movementRow.element);
        }
      });
    }
  }

  updatePassives(actor) {
    const skills = actor.data.data.skills;

    if (skills) {
      if (skills.prc && skills.prc.passive) {
        this.psvPrcRow.setValue(skills.prc.passive);
        this.dataElement.appendChild(this.psvPrcRow.element);
      }
      if (skills.inv && skills.inv.passive) {
        this.psvInvRow.setValue(skills.inv.passive);
        this.dataElement.appendChild(this.psvInvRow.element);
      }

      if (skills.ins && skills.ins.passive) {
        this.psvInsRow.setValue(skills.ins.passive);
        this.dataElement.appendChild(this.psvInsRow.element);
      }
    }
  }

  updateResources(actor) {
    if (
      showDataType(actor, Settings.ResourcesMinimumPermission, Settings.HidePlayerResourcesFromGM)
    ) {
      const resources = actor.data.data.resources;
      if (resources) {
        this.updateResource(resources, this.r1Row, 1);
        this.updateResource(resources, this.r2Row, 2);
        this.updateResource(resources, this.r3Row, 3);
      }
    }
  }

  updateResource(resources, resourceRow, resourceNumber) {
    const resource = resources[resourceType(resourceNumber)];
    if (resource && (resource.value > 0 || resource.max > 0)) {
      resourceRow.setValue(resource.value, resource.max);
      this.dataElement.appendChild(resourceRow.element);
    }
  }

  updateSpellSlots(actor) {
    if (showDataType(actor, Settings.SpellsMinimumPermission, Settings.HidePlayerSpellsFromGM)) {
      getSpellSlots(actor).forEach((slots, i) => {
        if (slots.max > 0 && slots.max < 99) {
          const row = this.spellRows[i];
          row.setValue(slots.value, slots.max);
          this.dataElement.appendChild(row.element);
        }
      });
    }
  }

  updateItems(actor) {
    if (showDataType(actor, Settings.ItemsMinimumPermission, Settings.HidePlayerItemsFromGM)) {
      const items = actor.data.items;
      const fArr = [];
      const cArr = [];
      items &&
        items.forEach((item) => {
          if (shouldCalculateUses(item)) {
            const { uses, maxUses } = calculateUses(item);
            if (uses !== null) {
              const attributeRow = new AttributeRow(item.name, img(item.img));
              attributeRow.setValue(uses, maxUses);
              (item.type === 'feat' ? fArr : cArr).push({
                sort: item.sort,
                element: attributeRow.element,
              });
            }
          }
        });
      this.sortAndAdd(fArr);
      this.sortAndAdd(cArr);
    }
  }

  sortAndAdd(attributeArray) {
    attributeArray.sort(attributeSort);
    attributeArray.forEach((attr) => {
      this.dataElement.appendChild(attr.element);
    });
  }
}

const showDataType = (actor, minimumPermissionSetting, hideFromGMSetting) => {
  const minimumPermission = minimumPermissionSetting.get();
  if (minimumPermission === HIDE_FROM_EVERYONE_OPTION) {
    return false;
  } else if (hideFromGMSetting && game.user.isGM) {
    return !(actor.hasPlayerOwner && hideFromGMSetting.get());
  } else {
    return actor.hasPerm(game.user, minimumPermission);
  }
};

const getSpellSlots = (actor) => {
  const spells = actor.data.data.spells;
  if (!spells) {
    return [];
  }
  return [
    spells.pact,
    spells.spell1,
    spells.spell2,
    spells.spell3,
    spells.spell4,
    spells.spell5,
    spells.spell6,
    spells.spell7,
    spells.spell8,
    spells.spell9,
  ];
};

const attributeSort = (a, b) => {
  return a.sort - b.sort;
};

const shouldShowTooltip = (token) => {
  if (!(token && token.actor)) {
    return false;
  }
  if (game.user.isGM) {
    return true;
  }
  return Settings.Visibility.shouldShowTooltip(token);
};

class AttributeRow {
  constructor(name, icon) {
    const row = div(CSS_ROW);

    const label = span(CSS_LABEL);
    if (icon) {
      label.appendChild(icon);
      label.title = name;
    } else {
      appendText(label, name);
    }
    row.appendChild(label);

    const valueDisplay = span(CSS_VALUE);
    row.appendChild(valueDisplay);

    const currDisplay = span(CSS_CURRENT);
    valueDisplay.appendChild(currDisplay);

    this.valueDisplay = valueDisplay;
    this.currDisplay = currDisplay;

    this.element = row;
  }

  setValue(value, max = null, temp = null, tempMax = null) {
    emptyNode(this.currDisplay);
    addIntegerLikeValueWithTemp(this.currDisplay, value, temp);
    if (max) {
      if (this.maxDisplay) {
        emptyNode(this.maxDisplay);
      } else {
        this.maxDisplay = span(CSS_MAX);
        this.valueDisplay.appendChild(this.maxDisplay);
      }
      addIntegerLikeValueWithTemp(this.maxDisplay, max, tempMax);
    } else {
      if (this.maxDisplay) {
        this.valueDisplay.removeChild(this.maxDisplay);
        this.maxDisplay = null;
      }
    }
  }
}

const addIntegerLikeValueWithTemp = (element, valueMaybeNull, tempValue) => {
  const value = valueMaybeNull || 0;
  if (!!tempValue) {
    element.classList.add(CSS_TEMP);
    const withTemp = '' + (parseInt(value, 10) + parseInt(tempValue, 10));
    appendText(element, withTemp);
  } else {
    element.classList.remove(CSS_TEMP);
    appendText(element, value);
  }
};

Hooks.once('ready', () => {
  new Tooltip();
});

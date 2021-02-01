import Settings, { HIDE_FROM_EVERYONE_OPTION } from '../settings/index.js';
import { CSS_PREFIX } from '../module.js';
import { icon, emptyNode, img, div, span, appendText } from './html.js';
import { shouldCalculateUses, calculateUses } from '../item-system.js';

import AttributeRow from './attribute-row.js';

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

    this.hpRow = new AttributeRow(game.i18n.localize('DND5E.HitPoints'), 'heart');
    this.acRow = new AttributeRow(game.i18n.localize('DND5E.ArmorClass'), 'user-shield');
    this.psvPrcRow = new AttributeRow(passiveSkillLabel('Prc'), 'eye');
    this.psvInvRow = new AttributeRow(passiveSkillLabel('Inv'), 'search');
    this.psvInsRow = new AttributeRow(passiveSkillLabel('Ins'), 'brain');

    this.movementRows = [];
    MOVEMENTS.forEach((movementType) => {
      this.movementRows.push(
        new AttributeRow(
          game.i18n.localize(`DND5E.Movement${capitalize(movementType.name)}`),
          movementType.icon
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

    this.customRows = [];

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

    this.updateCustomRows(actor);
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

  updateCustomRows(actor) {
    const customRows = Settings.CustomOptions.get();
    if (!customRows || customRows.length === 0) {
      return;
    }
    customRows.forEach((customRow, i) => {
      if (!showDataType(actor, customRow.permission, customRow.hideFromGM)) {
        return;
      }
      const attributeKey = customRow.attributeKey;
      const attribute = getProperty(actor.data, attributeKey);
      console.log(`${attributeKey}: ${attribute}`);
      let value;
      let max;
      let temp;
      let tempMax;
      if (attribute === '') {
        return;
      } else if (typeof attribute === 'number' || typeof attribute === 'string') {
        value = attribute;
        max = null;
        temp = null;
        tempMax = null;
      } else if (typeof attribute === 'object') {
        value = attribute.value;
        max = attribute.max;
        temp = attribute.temp;
        tempMax = attribute.tempMax;
      } else {
        return;
      }

      const name = customRow.name;
      const iconElem = customRow.icon;
      let row;
      if (!this.customRows[i]) {
        row = new AttributeRow(name, iconElem);
        this.customRows[i] = row;
      } else {
        row = this.customRows[i];
        row.setNameAndIcon(name, iconElem);
      }
      row.setValue(value, max, temp, tempMax);
      this.dataElement.appendChild(row.element);
    });
  }

  sortAndAdd(attributeArray) {
    attributeArray.sort(attributeSort);
    attributeArray.forEach((attr) => {
      this.dataElement.appendChild(attr.element);
    });
  }
}

const perm = (minimumPermissionSetting) => {
  if (!minimumPermissionSetting) {
    return 'NONE';
  }
  if (typeof minimumPermissionSetting === 'string') {
    return minimumPermissionSetting;
  }
  return minimumPermissionSetting.get() || 'NONE';
};

const boolOrBoolSetting = (boolSetting) => {
  if (typeof boolSetting === 'boolean') {
    return boolSetting;
  }
  return boolSetting && boolSetting.get();
};

const showDataType = (actor, minimumPermissionSetting, hideFromGMSetting) => {
  const minimumPermission = perm(minimumPermissionSetting);
  if (minimumPermission === HIDE_FROM_EVERYONE_OPTION) {
    return false;
  } else if (game.user.isGM) {
    return !(actor.hasPlayerOwner && boolOrBoolSetting(hideFromGMSetting));
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

Hooks.once('ready', () => {
  new Tooltip();
});

import icon from '../../html/icon';
import span from '../../html/span';
import module from '../../module';
import { LocalizedAndRawValue, LocalizedValueSimplifier } from '../LocalizedValueSimplifier';
import a5eSystemID from '../systems/a5e/systemID';
import d35eSystemID from '../systems/d35e/systemID';
import dnd4eSystemID from '../systems/dnd4e/systemID';
import dnd5eSystemID from '../systems/dnd5e/systemID';
import pf1SystemID from '../systems/pf1/systemID';
import pf2eSystemID from '../systems/pf2e/systemID';
import sfrpgSystemID from '../systems/sfrpg/systemID';
import damageTypeMap from './damageTypeMap';

const supportedSystems = [a5eSystemID, d35eSystemID, dnd4eSystemID, dnd5eSystemID, pf1SystemID, pf2eSystemID, sfrpgSystemID];

const iconAndTextClass = module.cssPrefix.childPrefix('damage-type').child('icon-and-text');

type SimplifyDamageTypeOption = ('NONE' | 'ICON' | 'COLOR_ICON' | 'COLOR' | 'ICON_AND_TEXT');

export const SimplifyDamageTypeChoice = module.settings.register<SimplifyDamageTypeOption>('simplifyDamageTypes', String, 'NONE', {
  hasHint: true,
  choices: [
    'NONE', 'ICON', 'COLOR_ICON', 'COLOR', 'ICON_AND_TEXT',
  ],
  config: () => supportedSystems.includes(game.system.id),
});

const stylizeDamageType = (value: LocalizedAndRawValue, useIcon: boolean, useColor: boolean, appendText: boolean) => {
  const type = value.raw.toLowerCase();
  const config = damageTypeMap.get(type);

  let node: HTMLElement;
  if (useIcon && config?.iconKey) {
    const iconNode = icon(config.iconKey);
    if (config.cssClass) {
      iconNode.classList.add(config.cssClass);
    }
    if (!appendText) {
      iconNode.title = value.localized;
    }
    if (appendText || value.suffix) {
      node = span(iconAndTextClass);
      node.appendChild(iconNode);
      if (appendText) {
        node.appendChild(document.createTextNode('\u00a0'));
        node.appendChild(document.createTextNode(value.localized));
      }
    } else {
      node = iconNode;
    }
  } else {
    node = document.createElement('span');
    node.appendChild(document.createTextNode(value.localized));
  }
  if (useColor && config?.color) {
    node.style.color = config.color;
  }
  if (value.suffix) {
    node.appendChild(document.createTextNode('\u00a0'));
    node.appendChild(document.createTextNode(value.suffix));
  }
  return node;
};

const Simplifiers = {
  NONE: (value) => {
    return document.createTextNode(`${value.localized}${value.suffix ? '\u00a0' : ''}${value.suffix ?? ''}`);
  },
  ICON: (value) => stylizeDamageType(value, true, false, false),
  COLOR_ICON: (value) => stylizeDamageType(value, true, true, false),
  COLOR: (value) => stylizeDamageType(value, false, true, false),
  ICON_AND_TEXT: (value) => stylizeDamageType(value, true, true, true),
} satisfies Record<SimplifyDamageTypeOption, LocalizedValueSimplifier>;


export default (value: LocalizedAndRawValue) => {
  const simplifier = Simplifiers[SimplifyDamageTypeChoice.get()] ?? Simplifiers.NONE;
  return simplifier(value);
};

import icon from '../../html/icon';
import span from '../../html/span';
import module from '../../module';
import { LocalizedAndRawValue, LocalizedValueSimplifier } from '../LocalizedValueSimplifier';
import damageTypeMap from './damageTypeMap';

const iconAndTextClass = module.cssPrefix.childPrefix('damage-type').child('icon-and-text');

type SimplifyDamageTypeOption = ('NONE' | 'ICON' | 'COLOR_ICON' | 'COLOR' | 'ICON_AND_TEXT');

export const SimplifyDamageTypeChoice = module.settings.register<SimplifyDamageTypeOption>('simplifyDamageTypes', String, 'NONE', {
  hasHint: true,
  choices: [
    'NONE', 'ICON', 'COLOR_ICON', 'COLOR', 'ICON_AND_TEXT',
  ],
});

const stylizeDamageType = (value: LocalizedAndRawValue, useIcon: boolean, useColor: boolean, appendText: boolean) => {
  const type = value.raw.toLowerCase();
  const config = damageTypeMap.get(type);

  let node: HTMLElement;
  if (useIcon && config?.iconKey) {
    const iconNode = icon(config.iconKey);
    if (appendText) {
      node = span(iconAndTextClass);
      node.appendChild(iconNode);
      node.appendChild(document.createTextNode('\u00a0'));
      node.appendChild(document.createTextNode(value.localized));
    } else {
      iconNode.title = value.localized;
      node = iconNode;
    }
  } else {
    node = document.createElement('span');
    node.appendChild(document.createTextNode(value.localized));
  }
  if (useColor && config?.color) {
    node.style.color = config.color;
  }
  return node;
};

const Simplifiers = {
  NONE: (value) => document.createTextNode(value.localized),
  ICON: (value) => stylizeDamageType(value, true, false, false),
  COLOR_ICON: (value) => stylizeDamageType(value, true, true, false),
  COLOR: (value) => stylizeDamageType(value, false, true, false),
  ICON_AND_TEXT: (value) => stylizeDamageType(value, true, true, true),
} satisfies Record<SimplifyDamageTypeOption, LocalizedValueSimplifier>;


export default (value: LocalizedAndRawValue) => {
  const simplifier = Simplifiers[SimplifyDamageTypeChoice.get()] ?? Simplifiers.NONE;
  return simplifier(value);
};

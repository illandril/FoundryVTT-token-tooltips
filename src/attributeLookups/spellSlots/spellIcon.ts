import icon from '../../html/icon';
import span from '../../html/span';
import module from '../../module';

const CSS_SPELLSLOT = module.cssPrefix.child('spellslot');
const CSS_SPELLSLOT_LEVEL = module.cssPrefix.child('spellslot-level');

const spellIcon = (label: string) => {
  const slotIcon = span(CSS_SPELLSLOT);
  slotIcon.appendChild(icon('star'));
  const slotNumberDisp = span(CSS_SPELLSLOT_LEVEL);
  slotNumberDisp.appendChild(document.createTextNode(label));
  slotIcon.appendChild(slotNumberDisp);
  return slotIcon;
};

export default spellIcon;

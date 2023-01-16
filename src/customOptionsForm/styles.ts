import module from '../module';
import './styles.scss';

const FORM_CSS_PREFIX = module.cssPrefix.childPrefix('menu').childPrefix('customOptions');
const CSS = {
  HELP_TOGGLE_ID: FORM_CSS_PREFIX.child('helpToggle'),
  HELP_TOGGLE_ON: FORM_CSS_PREFIX.child('helpToggle-on'),
  HELP_TOGGLE_OFF: FORM_CSS_PREFIX.child('helpToggle-off'),

  DEBUG_TOGGLE: FORM_CSS_PREFIX.child('toggleDebug'),
  DEBUG_TOGGLE_ON: FORM_CSS_PREFIX.child('toggleDebug-on'),
  ACTIONS: FORM_CSS_PREFIX.child('actions'),
  CUSTOM_OPTIONS_TITLE: FORM_CSS_PREFIX.child('customOptionsTitle'),
  STANDARD_OPTIONS_TITLE: FORM_CSS_PREFIX.child('standardOptionsTitle'),
  HEADER: FORM_CSS_PREFIX.child('header'),

  ADD_ROW_ID: FORM_CSS_PREFIX.child('addRow'),
  DELETE: FORM_CSS_PREFIX.child('delete'),
  MOVE_DOWN: FORM_CSS_PREFIX.child('moveDown'),
  MOVE_UP: FORM_CSS_PREFIX.child('moveUp'),
  DATA: FORM_CSS_PREFIX.child('data'),

  DISABLED_INPUT: FORM_CSS_PREFIX.child('disabledInput'),

  ICON_CELL: FORM_CSS_PREFIX.child('iconCell'),
  ICON_PREVIEW: FORM_CSS_PREFIX.child('iconPreview'),
  PERMISSIONS_CELL: FORM_CSS_PREFIX.child('permissionsCell'),
  GM_PERMISSIONS_CELL: FORM_CSS_PREFIX.child('gmPermissionsCell'),
} as const;

export default CSS;

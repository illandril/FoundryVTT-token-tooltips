import module from '../module';
import './styles.scss';

const FORM_CSS_PREFIX = module.cssPrefix.childPrefix('menu').childPrefix('customOptions');

export const HELP_TOGGLE_ID = FORM_CSS_PREFIX.child('helpToggle');
export const HELP_TOGGLE_ON = FORM_CSS_PREFIX.child('helpToggle-on');
export const HELP_TOGGLE_OFF = FORM_CSS_PREFIX.child('helpToggle-off');

export const DEBUG_TOGGLE = FORM_CSS_PREFIX.child('toggleDebug');
export const DEBUG_TOGGLE_ON = FORM_CSS_PREFIX.child('toggleDebug-on');
export const ACTIONS = FORM_CSS_PREFIX.child('actions');
export const CUSTOM_OPTIONS_TITLE = FORM_CSS_PREFIX.child('customOptionsTitle');
export const STANDARD_OPTIONS_TITLE = FORM_CSS_PREFIX.child('standardOptionsTitle');
export const HEADER = FORM_CSS_PREFIX.child('header');
export const HEADER_BOOLEAN = FORM_CSS_PREFIX.child('header_boolean');

export const ADD_ROW_ID = FORM_CSS_PREFIX.child('addRow');
export const DELETE = FORM_CSS_PREFIX.child('delete');
export const MOVE_DOWN = FORM_CSS_PREFIX.child('moveDown');
export const MOVE_UP = FORM_CSS_PREFIX.child('moveUp');
export const DATA = FORM_CSS_PREFIX.child('data');

export const DISABLED_INPUT = FORM_CSS_PREFIX.child('disabledInput');

export const ICON_CELL = FORM_CSS_PREFIX.child('iconCell');
export const ICON_PREVIEW = FORM_CSS_PREFIX.child('iconPreview');
export const PERMISSIONS_CELL = FORM_CSS_PREFIX.child('permissionsCell');
export const GM_PERMISSIONS_CELL = FORM_CSS_PREFIX.child('gmPermissionsCell');
export const SHOW_ON_PERSISTENT_CELL = FORM_CSS_PREFIX.child('showOnPersistentCell');

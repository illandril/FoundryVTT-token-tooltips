import module from '../module';

const FORM_CSS_PREFIX = module.cssPrefix.childPrefix('menu').childPrefix('persistentTooltips');

export const HELP_TOGGLE_ID = FORM_CSS_PREFIX.child('helpToggle');
export const HELP_TOGGLE_ON = FORM_CSS_PREFIX.child('helpToggle-on');
export const HELP_TOGGLE_OFF = FORM_CSS_PREFIX.child('helpToggle-off');

export const DATA = FORM_CSS_PREFIX.child('data');

export const HEADER = FORM_CSS_PREFIX.child('header');

export const TYPE_CELL = FORM_CSS_PREFIX.child('typeCell');
export const ID_CELL = FORM_CSS_PREFIX.child('idCell');
export const ID_STATE = FORM_CSS_PREFIX.child('idState');
export const POSITION_CELL = FORM_CSS_PREFIX.child('positionCell');
export const ROTATION_CELL = FORM_CSS_PREFIX.child('rotationCell');
export const ACTIONS = FORM_CSS_PREFIX.child('actions');

export const ADD_ROW_ID = FORM_CSS_PREFIX.child('addRow');
export const DELETE = FORM_CSS_PREFIX.child('delete');
export const MOVE_DOWN = FORM_CSS_PREFIX.child('moveDown');
export const MOVE_UP = FORM_CSS_PREFIX.child('moveUp');

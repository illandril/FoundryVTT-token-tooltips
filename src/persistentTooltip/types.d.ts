type VERTICAL_POSITION = 'top' | 'center' | 'bottom';
type HORIZONTAL_POSITION = 'left' | 'center' | 'right';

export type PersistentTooltipPosition = {
  vertical: VERTICAL_POSITION
  horizontal: HORIZONTAL_POSITION
  rotation?: number
};

export type PersistentTooltipOption = {
  type: 'user' | 'actor'
  id: string
  position: PersistentTooltipPosition
};

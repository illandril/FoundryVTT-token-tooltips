type VerticalPosition = 'top' | 'center' | 'bottom';
type HorizontalPosition = 'left' | 'center' | 'right';

export type PersistentTooltipPosition = {
  vertical: VerticalPosition;
  horizontal: HorizontalPosition;
  rotation?: number;
};

export type PersistentTooltipOption = {
  type: 'user' | 'actor';
  id: string;
  position: PersistentTooltipPosition;
};

import module from '../module';
import render from './render';
import type { PersistentTooltipOption } from './types';

const PersistentTooltips = module.settings.register<PersistentTooltipOption[]>('persistentTooltips', Object, [], {
  config: false,
  scope: 'client',
  onChange: (value) => {
    render(value);
  },
});

Hooks.on('ready', () => {
  render(PersistentTooltips.get());
});

export default PersistentTooltips;

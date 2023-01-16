import './styles.scss';
import Tooltip from './Tooltip';

Hooks.once('ready', () => {
  new Tooltip();
});

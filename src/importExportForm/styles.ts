import module from '../module';
import './styles.scss';

const FORM_CSS_PREFIX = module.cssPrefix.childPrefix('menu').childPrefix('importExport');
const CSS = {
  IMPORT: FORM_CSS_PREFIX.child('import'),
  EXPORT: FORM_CSS_PREFIX.child('export'),
  CLOSE: FORM_CSS_PREFIX.child('close'),
} as const;

export default CSS;

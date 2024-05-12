import module from '../module';
import './styles.scss';

const FORM_CSS_PREFIX = module.cssPrefix.childPrefix('menu').childPrefix('importExport');

export const IMPORT = FORM_CSS_PREFIX.child('import');
export const EXPORT = FORM_CSS_PREFIX.child('export');
export const CLOSE = FORM_CSS_PREFIX.child('close');

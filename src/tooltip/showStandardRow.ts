import { StandardOption } from '../settings/StandardOptions';
import showDataType from './showDataType';

const showStandardRow = (actor: Actor, option: StandardOption) => {
  return showDataType(actor, option.permission.get(), option.hideFromGM.get());
};

export default showStandardRow;

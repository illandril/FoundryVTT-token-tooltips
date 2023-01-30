import { StandardOption } from '../settings/StandardOptions';
import showDataType from './showDataType';

const showStandardRow = (actor: Actor, token: Token, option: StandardOption) => {
  return showDataType(actor, token, option.permission.get(), option.hideFromGM.get());
};

export default showStandardRow;

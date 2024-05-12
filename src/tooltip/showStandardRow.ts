import type { StandardOption } from '../settings/standardOptions';
import showDataType from './showDataType';

const showStandardRow = (actor: Actor, token: Token, option: StandardOption, isPersistent: boolean) => {
  if (isPersistent && option.hideOnPersistent.get()) {
    return false;
  }
  return showDataType(actor, token, option.permission.get(), option.hideFromGM.get());
};

export default showStandardRow;

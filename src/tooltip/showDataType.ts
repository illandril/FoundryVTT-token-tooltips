import {
  HIDE_FROM_EVERYONE_OPTION,
  SHOW_TO_GMS_ONLY,
  type StandardPermissionLevel,
} from '../settings/specialPermissions';

const showDataType = (actor: Actor, token: Token, minimumPermission: StandardPermissionLevel, hideFromGM: boolean) => {
  if (minimumPermission === HIDE_FROM_EVERYONE_OPTION) {
    return false;
  }
  if (game.user?.isGM) {
    return !(actor.hasPlayerOwner && hideFromGM);
  }
  if (minimumPermission === SHOW_TO_GMS_ONLY) {
    return false;
  }
  if (!game.user) {
    return false;
  }
  if (minimumPermission === 'FRIENDLY') {
    return token.document.disposition >= foundry.CONST.TOKEN_DISPOSITIONS.FRIENDLY;
  }
  if (minimumPermission === 'NEUTRAL') {
    return token.document.disposition >= foundry.CONST.TOKEN_DISPOSITIONS.NEUTRAL;
  }
  return actor.testUserPermission(game.user, minimumPermission);
};

export default showDataType;

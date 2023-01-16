import { HIDE_FROM_EVERYONE_OPTION, SHOW_TO_GMS_ONLY, StandardPermissionLevel } from '../settings/SpecialPermissions';

const showDataType = (
  actor: Actor,
  minimumPermission: StandardPermissionLevel,
  hideFromGM: boolean,
) => {
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
  return actor.testUserPermission(game.user, minimumPermission);
};

export default showDataType;

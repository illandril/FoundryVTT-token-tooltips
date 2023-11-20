import module from '../module';

type LookupInput = {
  type: string
  id: string
  silent?: boolean
};

export type LookupDetails = {
  name: string
  getCurrentToken: () => Token | null
};

const getToken = (actor: foundry.documents.BaseActor | null) => {
  return actor
    ? game.canvas.tokens?.placeables.find((placeable) => placeable.document?.actorLink && placeable.actor?.id === actor.id) ?? null
    : null;
};

const getActorTooltipConfig = (setting: LookupInput): LookupDetails | null => {
  const actor = game.actors.get(setting.id);
  if (!actor) {
    if (!setting.silent) {
      module.logger.error('Actor not found for PersistentTooltip', setting.id);
    }
    return null;
  }
  return {
    name: actor.name,
    getCurrentToken: () => getToken(actor),
  };
};

const getUserTooltipConfig = (setting: LookupInput): LookupDetails | null => {
  const user = game.users.get(setting.id);
  if (!user) {
    if (!setting.silent) {
      module.logger.error('User not found for PersistentTooltip', setting.id);
    }
    return null;
  }
  return {
    name: user.name,
    getCurrentToken: () => getToken(user.character),
  };
};


const lookup = (setting: LookupInput) => {
  let args: LookupDetails | null;
  switch (setting.type) {
    case 'actor':
      args = getActorTooltipConfig(setting);
      break;
    case 'user':
      args = getUserTooltipConfig(setting);
      break;
    default:
      args = null;
      module.logger.error('Invalid PersistentTooltip setting', setting);
  }
  return args;
};

export default lookup;

import AttributeLookup, { getAttributeValue, SimpleActorAttributeLookup } from './AttributeLookup';
import isDND35LiteNPC from './systems/d35e/isLiteNPC';
import isPF1LiteNPC from './systems/pf1/isLiteNPC';

export default [
  // Standard AC
  new AttributeLookup(
    () => 'user-shield',
    () => {
      switch (game.system.id) {
        case 'dnd5e':
          return game.i18n.localize('DND5E.ArmorClass');
        case 'pf1':
          return game.i18n.localize('PF1.ACNormal');
        case 'pf2e':
          return game.i18n.localize('PF2E.ArmorClassLabel');
        case 'D35E':
          return game.i18n.localize('D35E.ACNormal');
        case 'demonlord':
          return game.i18n.localize('DL.CharDefense');
        case 'swade':
          return game.i18n.localize('SWADE.Tough');
        default:
          return '[AC]';
      }
    },
    (actor) => {
      if (isDND35LiteNPC(actor) || isPF1LiteNPC(actor)) {
        return null;
      }
      return getAttributeValue(actor.system, [
        // Pathfinder 1 & 2, D&D 3.5
        'attributes.ac.normal',
        // DnD5E
        'attributes.ac',
        // Shadow of the Demon Lord
        'characteristics.defense',
        // SWADE
        'stats.toughness',
      ]);
    },
  ),

  // Touch AC (Pathfinder 1 & D&D 3.5)
  new AttributeLookup(
    () => null,
    () => game.i18n.localize('illandril-token-tooltips.touchACAbbreviation'),
    (actor) => {
      if (isDND35LiteNPC(actor) || isPF1LiteNPC(actor)) {
        return null;
      }
      return getAttributeValue(actor, ['system.attributes.ac.touch']);
    },
  ),
  // Flat-footed AC (Pathfinder 1 & D&D 3.5)
  new AttributeLookup(
    () => null,
    () => game.i18n.localize('illandril-token-tooltips.flatFootedACAbbreviation'),
    (actor) => {
      if (isDND35LiteNPC(actor) || isPF1LiteNPC(actor)) {
        return null;
      }
      return getAttributeValue(actor, ['system.attributes.ac.flatFooted']);
    },
  ),
  // Combat Maneuver Defense (Pathfinder 1 & D&D 3.5)
  new AttributeLookup(
    () => null,
    () => game.i18n.localize('illandril-token-tooltips.cmdAbbreviation'),
    (actor) => {
      if (isDND35LiteNPC(actor) || isPF1LiteNPC(actor)) {
        return null;
      }
      return getAttributeValue(actor, ['system.attributes.cmd']);
    },
  ),

  // Soak (starwarsffg)
  new SimpleActorAttributeLookup(
    () => null,
    () => game.i18n.localize('SWFFG.Soak'),
    ['system.stats.soak'],
  ),
  // Melee Defense (starwarsffg)
  new SimpleActorAttributeLookup(
    () => null,
    () => game.i18n.localize('illandril-token-tooltips.meleeDefenseAbbreviation'),
    ['system.stats.defence.melee'],
  ),
  // Ranged Defense (starwarsffg)
  new SimpleActorAttributeLookup(
    () => null,
    () => game.i18n.localize('illandril-token-tooltips.rangedDefenseAbbreviation'),
    ['system.stats.defence.ranged'],
  ),
] satisfies AttributeLookup[];

import isDND35LiteNPC from './d35e/isLiteNPC.js';
import isPF1LiteNPC from './pf1/isLiteNPC.js';

export default [
  // Standard AC
  {
    icon: () => {
      return 'user-shield';
    },
    label: () => {
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
      }
      return '[AC]';
    },
    value: (actor) => {
      if(isDND35LiteNPC(actor) || isPF1LiteNPC(actor)) {
        return null;
      }
      return (
        // Pathfinder 1 & 2, D&D 3.5
        getProperty(actor, 'data.data.attributes.ac.normal') ||
        // DnD5E
        getProperty(actor, 'data.data.attributes.ac') ||
        // Shadow of the Demon Lord
        getProperty(actor, 'data.data.characteristics.defense') ||
        // SWADE
        getProperty(actor, 'data.data.stats.toughness')
      );
    },
  },

  // Touch AC
  {
    icon: () => null,
    label: () => game.i18n.localize('illandril-token-tooltips.touchACAbbreviation'),
    // Pathfinder 1 & D&D 3.5
    value: (actor) => {
      if(isDND35LiteNPC(actor) || isPF1LiteNPC(actor)) {
        return null;
      }
      return getProperty(actor, 'data.data.attributes.ac.touch');
    },
  },

  // Flat-footed AC
  {
    icon: () => null,
    label: () => game.i18n.localize('illandril-token-tooltips.flatFootedACAbbreviation'),
    // Pathfinder 1 & D&D 3.5
    value: (actor) => {
      if(isDND35LiteNPC(actor) || isPF1LiteNPC(actor)) {
        return null;
      }
      return getProperty(actor, 'data.data.attributes.ac.flatFooted');
    },
  },

  // Combat Maneuver Defense
  {
    icon: () => null,
    label: () => game.i18n.localize('illandril-token-tooltips.cmdAbbreviation'),
    // Pathfinder 1 & D&D 3.5
    value: (actor) => {
      if(isDND35LiteNPC(actor) || isPF1LiteNPC(actor)) {
        return null;
      }
      return getProperty(actor, 'data.data.attributes.cmd');
    },
  },

  // Soak
  {
    icon: () => null,
    label: () => game.i18n.localize('SWFFG.Soak'),
    // starwarsffg
    value: (actor) => getProperty(actor, 'data.data.stats.soak'),
  },

  // Melee Defense
  {
    icon: () => null,
    label: () => game.i18n.localize('illandril-token-tooltips.meleeDefenseAbbreviation'),
    // starwarsffg
    value: (actor) => getProperty(actor, 'data.data.stats.defence.melee'),
  },

  // Ranged Defense
  {
    icon: () => null,
    label: () => game.i18n.localize('illandril-token-tooltips.rangedDefenseAbbreviation'),
    // starwarsffg
    value: (actor) => getProperty(actor, 'data.data.stats.defence.ranged'),
  },
];

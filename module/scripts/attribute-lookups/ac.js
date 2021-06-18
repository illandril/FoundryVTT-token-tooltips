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
      return (
        // Pathfinder
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
    value: (actor) => getProperty(actor, 'data.data.attributes.ac.touch'),
  },

  // Flat-footed AC
  {
    icon: () => null,
    label: () => game.i18n.localize('illandril-token-tooltips.flatFootedACAbbreviation'),
    // Pathfinder 1 & D&D 3.5
    value: (actor) => getProperty(actor, 'data.data.attributes.ac.flatFooted'),
  },

  // Combat Maneuver Defense
  {
    icon: () => null,
    label: () => game.i18n.localize('illandril-token-tooltips.cmdAbbreviation'),
    // Pathfinder 1 & D&D 3.5
    value: (actor) => getProperty(actor, 'data.data.attributes.cmd'),
  },
];

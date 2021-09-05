export default [
  // Standard HP
  {
    icon: () => 'heart',
    label: () => {
      switch (game.system.id) {
        case 'dnd5e':
          return game.i18n.localize('DND5E.HitPoints');
        case 'pf1':
          return game.i18n.localize('PF1.HitPoints');
        case 'pf2e':
          return game.i18n.localize('PF2E.HitPointsHeader');
        case 'D35E':
          return game.i18n.localize('D35E.HitPoints');
        case 'demonlord':
          return game.i18n.localize('DL.CharHealthDamage');
        case 'swade':
          return game.i18n.localize('SWADE.Wounds');
        case 'gurps4e':
          return game.i18n.localize('GURPS4E.attributes.hp');
      }
      return '[HP]';
    },
    value: (actor) => {
      return (
        // DnD5E and Pathfinder
        getProperty(actor, 'data.data.attributes.hp') ||
        // Simple World-Building
        getProperty(actor, 'data.data.health') ||
        // Shadow of the Demon Lord
        getProperty(actor, 'data.data.characteristics.health') ||
        // SWADE
        getProperty(actor, 'data.data.wounds') ||
        // GURPS
        getProperty(actor, 'data.data.tracked.hp')
      );
    },
  },
  {
    icon: () => null,
    label: () => game.i18n.localize('SWFFG.Wounds'),
    // starwarsffg
    value: (actor) => getProperty(actor, 'data.data.stats.wounds'),
  },
  {
    icon: () => null,
    label: () => game.i18n.localize('SWFFG.Strain'),
    // starwarsffg
    value: (actor) => getProperty(actor, 'data.data.stats.strain'),
  }
];

export const icon = () => {
  return 'user-shield';
};

export const label = () => {
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
};

export const value = (actor) => {
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
};

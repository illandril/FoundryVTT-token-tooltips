const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const passive = (key, icon) => {
  return {
    icon: () => icon,
    label: () => {
      switch (game.system.id) {
        case 'dnd5e':
          return (
            game.i18n.localize(`DND5E.Skill${capitalize(key)}`) +
            ' (' +
            game.i18n.localize('DND5E.Passive') +
            ')'
          );
      }
      return `[${key.toUpperCase()}]`;
    },
    value: (actor) => getProperty(actor, `data.data.skills.${key}.passive`),
  };
};

export default [passive('prc', 'eye'), passive('inv', 'search'), passive('ins', 'brain')];

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

export default [
  // dnd5e (and similar system) passives
  passive('prc', 'eye'),
  passive('inv', 'search'),
  passive('ins', 'brain'),

  // PF1 Perception
  {
    icon: () => 'eye',
    label: () => {
      return game.i18n.localize('PF1.SkillPer');
    },
    value: (actor) => {
      if (game.system.id !== 'pf1') {
        return null;
      }
      return getProperty(actor, `data.data.skills.per.mod`);
    },
  },
];

const damageTypeMap = new Map<string, { iconKey: string, color?: string }>();

const physicalColor = '#444';

damageTypeMap.set('acid', {
  iconKey: 'droplet',
  color: '#306100',
});
damageTypeMap.set('air', {
  iconKey: 'wind',
  color: '#555',
});
damageTypeMap.set('auditory', {
  iconKey: 'ear-listen',
});
damageTypeMap.set('bleed', {
  iconKey: 'bandage',
  color: '#A00',
});
damageTypeMap.set('blinded', {
  iconKey: 'eye-slash',
});
damageTypeMap.set('bludgeoning', {
  iconKey: 'hammer-war',
  color: physicalColor,
});
damageTypeMap.set('chaotic', {
  iconKey: 'arrows-cross',
});
damageTypeMap.set('charmed', {
  iconKey: 'heart',
  color: '#924',
});
damageTypeMap.set('cold', {
  iconKey: 'snowflake',
  color: '#005B90',
});

const confused = {
  iconKey: 'face-confused',
};
damageTypeMap.set('confused', confused);
damageTypeMap.set('confusion', confused);

damageTypeMap.set('deafened', {
  iconKey: 'ear-deaf',
});

const diseased = {
  iconKey: 'face-mask',
  color: '#306100',
};
damageTypeMap.set('disease', diseased);
damageTypeMap.set('diseased', diseased);

damageTypeMap.set('electricity', {
  iconKey: 'plug',
  color: '#5A5A00',
});

const fear = {
  iconKey: 'face-fearful',
};
damageTypeMap.set('fear', fear);
damageTypeMap.set('fear effects', fear);
damageTypeMap.set('fear-effects', fear);

damageTypeMap.set('fire', {
  iconKey: 'fire',
  color: '#840',
});

const frightened = {
  iconKey: 'face-scream',
};
damageTypeMap.set('fright', frightened);
damageTypeMap.set('frightened', frightened);

damageTypeMap.set('force', {
  iconKey: 'comet',
  color: '#00A',
});
damageTypeMap.set('healing', {
  iconKey: 'kit-medical',
  color: '#A00',
});
damageTypeMap.set('lawful', {
  iconKey: 'scale-balanced',
});
damageTypeMap.set('light', {
  iconKey: 'lightbulb-on',
  color: '#5A5A00',
});
damageTypeMap.set('lightning', {
  iconKey: 'bolt-lightning',
  color: '#5A5A00',
});

const magic = {
  iconKey: 'hat-wizard',
  color: '#00A',
} as const;
damageTypeMap.set('magic', magic);
damageTypeMap.set('magical', magic);

damageTypeMap.set('mental', {
  iconKey: 'brain',
  color: '#50B',
});
damageTypeMap.set('necrotic', {
  iconKey: 'scythe',
  color: '#000',
});
damageTypeMap.set('necromancy', {
  iconKey: 'skull',
  color: '#555',
});
damageTypeMap.set('negative', {
  iconKey: 'square-minus',
});
damageTypeMap.set('olfactory', {
  iconKey: 'nose',
});
damageTypeMap.set('piercing', {
  iconKey: 'bow-arrow',
  color: physicalColor,
});
damageTypeMap.set('plant', {
  iconKey: 'leaf',
  color: '#060',
});
damageTypeMap.set('poison', {
  iconKey: 'flask-round-poison',
  color: '#060',
});
damageTypeMap.set('poisoned', {
  iconKey: 'face-vomit',
  color: '#060',
});
damageTypeMap.set('positive', {
  iconKey: 'square-plus',
});
damageTypeMap.set('psychic', {
  iconKey: 'brain-circuit',
  color: '#50B',
});
damageTypeMap.set('radiant', {
  iconKey: 'star-christmas',
  color: '#595933',
});
damageTypeMap.set('radiation', {
  iconKey: 'radiation',
  color: '#306100',
});
damageTypeMap.set('salt', {
  iconKey: 'salt-shaker',
});
damageTypeMap.set('slashing', {
  iconKey: 'sword',
  color: physicalColor,
});
damageTypeMap.set('sleep', {
  iconKey: 'snooze',
});

const sonic = {
  iconKey: 'volume-high',
  color: '#333',
};
damageTypeMap.set('sonic', sonic);
damageTypeMap.set('thunder', sonic);

const unarmed = {
  iconKey: 'hand-back-fist',
  color: physicalColor,
} as const;
damageTypeMap.set('unarmed', unarmed);
damageTypeMap.set('unarmed attacks', unarmed);
damageTypeMap.set('unarmed-attacks', unarmed);

damageTypeMap.set('visual', {
  iconKey: 'eyes',
});
damageTypeMap.set('water', {
  iconKey: 'water',
  color: '#00F',
});
damageTypeMap.set('weapons', {
  iconKey: 'swords',
  color: physicalColor,
});


export default damageTypeMap;


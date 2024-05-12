import module from '../../module';

const cssPrefix = module.cssPrefix.childPrefix('damage-types');
const rotateLeft = cssPrefix.child('rotate-left');

const damageTypeMap = new Map<string, { iconKey: string; color?: string; cssClass?: string }>();

const physicalColor = '#5E6B69';
const genericConditionColor = '#6D7174';
const electricityColor = '#946A19';

damageTypeMap.set('acid', {
  iconKey: 'droplet',
  color: '#316100',
});
damageTypeMap.set('air', {
  iconKey: 'wind',
  color: '#555',
});
damageTypeMap.set('auditory', {
  iconKey: 'ear-listen',
  color: '#24338A',
});
damageTypeMap.set('axe-vulnerability', {
  iconKey: 'axe',
  color: physicalColor,
});

const bleed = {
  iconKey: 'bandage',
  color: '#A00',
};
damageTypeMap.set('bleed', bleed);
damageTypeMap.set('bleeding', bleed);

damageTypeMap.set('blinded', {
  iconKey: 'eye-slash',
  color: genericConditionColor,
});
damageTypeMap.set('bludgeoning', {
  iconKey: 'hammer-war',
  color: physicalColor,
});
damageTypeMap.set('burning', {
  iconKey: 'campfire',
  color: '#CE3C02',
});
damageTypeMap.set('chaotic', {
  iconKey: 'arrows-cross',
});
damageTypeMap.set('charmed', {
  iconKey: 'hand-holding-heart',
  color: '#D4145A',
});
damageTypeMap.set('cold', {
  iconKey: 'snowflake',
  color: '#0078B4',
});

const confused = {
  iconKey: 'face-confused',
  color: genericConditionColor,
};
damageTypeMap.set('confused', confused);
damageTypeMap.set('confusion', confused);

damageTypeMap.set('critical-hits', {
  iconKey: 'bullseye-arrow',
});
damageTypeMap.set('deafened', {
  iconKey: 'ear-deaf',
  color: genericConditionColor,
});

const diseased = {
  iconKey: 'face-mask',
  color: '#6E7713',
};
damageTypeMap.set('disease', diseased);
damageTypeMap.set('diseased', diseased);

damageTypeMap.set('electricity', {
  iconKey: 'plug',
  color: electricityColor,
});

const exhaustion = {
  iconKey: 'face-hand-yawn',
  color: genericConditionColor,
};
damageTypeMap.set('exhaustion', exhaustion);
damageTypeMap.set('exhausted', exhaustion);

const fear = {
  iconKey: 'face-fearful',
  color: '#884A14',
};
damageTypeMap.set('fear', fear);
damageTypeMap.set('fear effects', fear);
damageTypeMap.set('fear-effects', fear);

damageTypeMap.set('fire', {
  iconKey: 'fire',
  color: '#CE3C02',
});

const frightened = {
  iconKey: 'face-scream',
  color: '#884A14',
};
damageTypeMap.set('fright', frightened);
damageTypeMap.set('frightened', frightened);

damageTypeMap.set('force', {
  iconKey: 'comet',
  color: '#1C00AF',
});
damageTypeMap.set('grappled', {
  iconKey: 'hands',
  color: '#69489D',
});
damageTypeMap.set('healing', {
  iconKey: 'kit-medical',
  color: '#A00',
});
damageTypeMap.set('incapacitated', {
  iconKey: 'face-eyes-xmarks',
  color: '#2E5D60',
});
damageTypeMap.set('invisible', {
  iconKey: 'face-dotted',
  color: '#007C99',
});
damageTypeMap.set('lawful', {
  iconKey: 'scale-balanced',
});
damageTypeMap.set('light', {
  iconKey: 'lightbulb-on',
  color: electricityColor,
});
damageTypeMap.set('lightning', {
  iconKey: 'bolt-lightning',
  color: electricityColor,
});

const magic = {
  iconKey: 'hat-wizard',
  color: '#1C00AF',
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
damageTypeMap.set('off-target', {
  iconKey: 'location-crosshairs-slash',
});
damageTypeMap.set('olfactory', {
  iconKey: 'nose',
});
damageTypeMap.set('overburdened', {
  iconKey: 'weight-hanging',
});
damageTypeMap.set('paralyzed', {
  iconKey: 'face-meh-blank',
  color: '#5F6349',
});
damageTypeMap.set('piercing', {
  iconKey: 'bow-arrow',
  color: physicalColor,
});
damageTypeMap.set('plant', {
  iconKey: 'leaf',
  color: '#060',
});
damageTypeMap.set('petrified', {
  iconKey: 'person-simple',
  color: genericConditionColor,
});
damageTypeMap.set('poison', {
  iconKey: 'skull-crossbones',
  color: '#03822F',
});
damageTypeMap.set('poisoned', {
  iconKey: 'face-vomit',
  color: '#03822F',
});
damageTypeMap.set('positive', {
  iconKey: 'square-plus',
});
damageTypeMap.set('prone', {
  iconKey: 'person',
  color: '#603813',
  cssClass: rotateLeft,
});
damageTypeMap.set('psychic', {
  iconKey: 'brain-circuit',
  color: '#841D80',
});
damageTypeMap.set('radiant', {
  iconKey: 'star-christmas',
  color: '#8F6D00',
});
damageTypeMap.set('radiation', {
  iconKey: 'radiation',
  color: '#306100',
});
damageTypeMap.set('restrained', {
  iconKey: 'hands-bound',
  color: '#52266F',
});
damageTypeMap.set('salt', {
  iconKey: 'salt-shaker',
});
damageTypeMap.set('slashing', {
  iconKey: 'sword',
  color: physicalColor,
});

const sleep = {
  iconKey: 'snooze',
};
damageTypeMap.set('asleep', sleep);
damageTypeMap.set('sleep', sleep);

damageTypeMap.set('stunned', {
  iconKey: 'face-spiral-eyes',
  color: '#6D6064',
});

damageTypeMap.set('sonic', {
  iconKey: 'volume-high',
  color: '#24338A',
});
damageTypeMap.set('thunder', {
  iconKey: 'cloud-bolt',
  color: '#24338A',
});

const unarmed = {
  iconKey: 'hand-back-fist',
  color: physicalColor,
} as const;
damageTypeMap.set('unarmed', unarmed);
damageTypeMap.set('unarmed attacks', unarmed);
damageTypeMap.set('unarmed-attacks', unarmed);

damageTypeMap.set('unconscious', {
  iconKey: 'wave-pulse',
  color: '#841717',
});
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

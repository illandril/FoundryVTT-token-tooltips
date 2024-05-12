import module from '../../module';

const cssPrefix = module.cssPrefix.childPrefix('damage-types');
const rotateLeft = cssPrefix.child('rotate-left');

const damageTypeMap = new Map<string, { iconKey: string; color?: string; colorDark?: string; cssClass?: string }>();

const physicalColor = '#5E6B69';
const physicalColorDark = '#8B9895';
const genericConditionColor = '#6D7174';
const genericConditionColorDark = '#818688';
const electricityColor = '#946A19';
const electricityColorDark = '#D69B24';

damageTypeMap.set('acid', {
  iconKey: 'droplet',
  color: '#316100',
  colorDark: '#61C200',
});
damageTypeMap.set('air', {
  iconKey: 'wind',
  color: '#555',
  colorDark: '#CCC',
});
damageTypeMap.set('auditory', {
  iconKey: 'ear-listen',
  color: '#24338A',
  colorDark: '#6576D7',
});
damageTypeMap.set('axe-vulnerability', {
  iconKey: 'axe',
  color: physicalColor,
  colorDark: physicalColorDark,
});

const bleed = {
  iconKey: 'bandage',
  color: '#A00',
  colorDark: '#F00',
};
damageTypeMap.set('bleed', bleed);
damageTypeMap.set('bleeding', bleed);

damageTypeMap.set('blinded', {
  iconKey: 'eye-slash',
  color: genericConditionColor,
  colorDark: genericConditionColorDark,
});
damageTypeMap.set('bludgeoning', {
  iconKey: 'hammer-war',
  color: physicalColor,
  colorDark: physicalColorDark,
});
damageTypeMap.set('burning', {
  iconKey: 'campfire',
  color: '#CE3C02',
  colorDark: '#FC4903',
});
damageTypeMap.set('chaotic', {
  iconKey: 'arrows-cross',
});
damageTypeMap.set('charmed', {
  iconKey: 'hand-holding-heart',
  color: '#D4145A',
  colorDark: '#ED407F',
});
damageTypeMap.set('cold', {
  iconKey: 'snowflake',
  color: '#0078B4',
  colorDark: '#00AAFF',
});

const confused = {
  iconKey: 'face-confused',
  color: genericConditionColor,
  colorDark: genericConditionColorDark,
};
damageTypeMap.set('confused', confused);
damageTypeMap.set('confusion', confused);

damageTypeMap.set('critical-hits', {
  iconKey: 'bullseye-arrow',
});
damageTypeMap.set('deafened', {
  iconKey: 'ear-deaf',
  color: genericConditionColor,
  colorDark: genericConditionColorDark,
});

const diseased = {
  iconKey: 'face-mask',
  color: '#6E7713',
  colorDark: '#6DAE1E',
};
damageTypeMap.set('disease', diseased);
damageTypeMap.set('diseased', diseased);

damageTypeMap.set('electricity', {
  iconKey: 'plug',
  color: electricityColor,
  colorDark: electricityColorDark,
});

const exhaustion = {
  iconKey: 'face-hand-yawn',
  color: genericConditionColor,
  colorDark: genericConditionColorDark,
};
damageTypeMap.set('exhaustion', exhaustion);
damageTypeMap.set('exhausted', exhaustion);

const fear = {
  iconKey: 'face-fearful',
  color: '#884A14',
  colorDark: '#BF681D',
};
damageTypeMap.set('fear', fear);
damageTypeMap.set('fear effects', fear);
damageTypeMap.set('fear-effects', fear);

damageTypeMap.set('fire', {
  iconKey: 'fire',
  color: '#CE3C02',
  colorDark: '#FC4903',
});

const frightened = {
  iconKey: 'face-scream',
  color: '#884A14',
  colorDark: '#BF681D',
};
damageTypeMap.set('fright', frightened);
damageTypeMap.set('frightened', frightened);

damageTypeMap.set('force', {
  iconKey: 'comet',
  color: '#1C00AF',
  colorDark: '#7B61FF',
});
damageTypeMap.set('grappled', {
  iconKey: 'hands',
  color: '#69489D',
  colorDark: '#9073BF',
});
damageTypeMap.set('healing', {
  iconKey: 'kit-medical',
  color: '#A00',
  colorDark: '#F00',
});
damageTypeMap.set('incapacitated', {
  iconKey: 'face-eyes-xmarks',
  color: '#2E5D60',
  colorDark: '#468D91',
});
damageTypeMap.set('invisible', {
  iconKey: 'face-dotted',
  color: '#007C99',
  colorDark: '#0089A8',
});
damageTypeMap.set('lawful', {
  iconKey: 'scale-balanced',
});
damageTypeMap.set('light', {
  iconKey: 'lightbulb-on',
  color: electricityColor,
  colorDark: electricityColorDark,
});
damageTypeMap.set('lightning', {
  iconKey: 'bolt-lightning',
  color: electricityColor,
  colorDark: electricityColorDark,
});

const magic = {
  iconKey: 'hat-wizard',
  color: '#1C00AF',
  colorDark: '#7B61FF',
} as const;
damageTypeMap.set('magic', magic);
damageTypeMap.set('magical', magic);

damageTypeMap.set('mental', {
  iconKey: 'brain',
  color: '#50B',
  colorDark: '#A55CFF',
});
damageTypeMap.set('necrotic', {
  iconKey: 'scythe',
  color: '#000',
  colorDark: '#7D7D7D',
});
damageTypeMap.set('necromancy', {
  iconKey: 'skull',
  color: '#555',
  colorDark: '#7D7D7D',
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
  colorDark: '#A4A88A',
});
damageTypeMap.set('piercing', {
  iconKey: 'bow-arrow',
  color: physicalColor,
  colorDark: physicalColorDark,
});
damageTypeMap.set('plant', {
  iconKey: 'leaf',
  color: '#060',
  colorDark: '#090',
});
damageTypeMap.set('petrified', {
  iconKey: 'person-simple',
  color: genericConditionColor,
  colorDark: genericConditionColorDark,
});
damageTypeMap.set('poison', {
  iconKey: 'skull-crossbones',
  color: '#03822F',
  colorDark: '#049F3A',
});
damageTypeMap.set('poisoned', {
  iconKey: 'face-vomit',
  color: '#03822F',
  colorDark: '#049F3A',
});
damageTypeMap.set('positive', {
  iconKey: 'square-plus',
});
damageTypeMap.set('prone', {
  iconKey: 'person',
  color: '#603813',
  colorDark: '#C07026',
  cssClass: rotateLeft,
});
damageTypeMap.set('psychic', {
  iconKey: 'brain-circuit',
  color: '#841D80',
  colorDark: '#D43ACF',
});
damageTypeMap.set('radiant', {
  iconKey: 'star-christmas',
  color: '#8F6D00',
  colorDark: '#E4B962',
});
damageTypeMap.set('radiation', {
  iconKey: 'radiation',
  color: '#306100',
  colorDark: '#57AD00',
});
damageTypeMap.set('restrained', {
  iconKey: 'hands-bound',
  color: '#52266F',
  colorDark: '#A86FCE',
});
damageTypeMap.set('salt', {
  iconKey: 'salt-shaker',
});
damageTypeMap.set('slashing', {
  iconKey: 'sword',
  color: physicalColor,
  colorDark: physicalColorDark,
});

const sleep = {
  iconKey: 'snooze',
};
damageTypeMap.set('asleep', sleep);
damageTypeMap.set('sleep', sleep);

damageTypeMap.set('stunned', {
  iconKey: 'face-spiral-eyes',
  color: '#6D6064',
  colorDark: '#A4989C',
});

damageTypeMap.set('sonic', {
  iconKey: 'volume-high',
  color: '#24338A',
  colorDark: '#6D7DD9',
});
damageTypeMap.set('thunder', {
  iconKey: 'cloud-bolt',
  color: '#24338A',
  colorDark: '#6D7DD9',
});

const unarmed = {
  iconKey: 'hand-back-fist',
  color: physicalColor,
  colorDark: physicalColorDark,
} as const;
damageTypeMap.set('unarmed', unarmed);
damageTypeMap.set('unarmed attacks', unarmed);
damageTypeMap.set('unarmed-attacks', unarmed);

damageTypeMap.set('unconscious', {
  iconKey: 'wave-pulse',
  color: '#841717',
  colorDark: '#E15656',
});
damageTypeMap.set('visual', {
  iconKey: 'eyes',
});
damageTypeMap.set('water', {
  iconKey: 'water',
  color: '#00F',
  colorDark: '#77F',
});
damageTypeMap.set('weapons', {
  iconKey: 'swords',
  color: physicalColor,
  colorDark: physicalColorDark,
});

export default damageTypeMap;

import module from '../../../module';

type HexDistanceType = ('GRID' | 'EUCLIDIAN');

export const HexDistanceChoice = module.settings.register<HexDistanceType>('hexDistanceChoice', String, 'GRID', {
  hasHint: true,
  choices: ['GRID', 'EUCLIDIAN'],
});

export const HexIncludeElevation = module.settings.register('hexIncludeElevation', Boolean, true, {
  hasHint: true,
});

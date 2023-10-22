import module from '../../../module';

type SquareDistanceType = ('GRID' | 'EUCLIDIAN' | 'EQUIDISTANT' | 'ALTERNATING');

export const SquareDistanceChoice = module.settings.register<SquareDistanceType>('squareDistanceChoice', String, 'GRID', {
  hasHint: true,
  choices: ['GRID', 'EUCLIDIAN', 'EQUIDISTANT', 'ALTERNATING'],
});

type SquareMeasureType = ('NEAREST' | 'CENTER_NEAR' | 'CENTER_FAR');

export const SquareMeasureFrom = module.settings.register<SquareMeasureType>('squareMeasureFrom', String, 'NEAREST', {
  hasHint: true,
  choices: ['NEAREST', 'CENTER_NEAR', 'CENTER_FAR'],
});

export const SquareIncludeElevation = module.settings.register('squareIncludeElevation', Boolean, true, {
  hasHint: true,
});

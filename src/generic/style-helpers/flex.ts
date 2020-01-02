export type TFlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';

export const flexIsRow = (value: TFlexDirection) => value === 'row' || value === 'row-reverse';

export const flexIsReversed = (value: TFlexDirection) => value.includes('reverse');

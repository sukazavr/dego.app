export type TFlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';

export const flexDirectionIsRow = (value: TFlexDirection) => value === 'row' || value === 'row-reverse';

export const flexDirectionIsReversed = (value: TFlexDirection) => value.includes('reverse');

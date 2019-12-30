import { isUndefined } from 'util';

export type TFlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';

export const flexIsRow = (value?: TFlexDirection) =>
  isUndefined(value) || value === 'row' || value === 'row-reverse';

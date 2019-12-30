import { isDefined } from './type-guards';

export const canUseDOM =
  isDefined(window) && isDefined(window.document) && isDefined(window.document.createElement);

export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = !isProduction;

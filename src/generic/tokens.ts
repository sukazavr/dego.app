export const regularFontFamily =
  'Roboto, "Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif';
export const monoFontFamily = '"Roboto Mono", monospace';

export const themeVariables = {
  'grid-size': '8px',
  base: '#fff',
  base100: '#F2F2F2',
  base300: '#A6A6A6',
  base500: '#404040',
  base900: '#000000',
  select100: '#E5F3FF',
  select500: '#0085FF',
  error500: '#FF5AA9',
};
export type TThemeVariable = keyof typeof themeVariables;

export const fontWeights = {
  normal: 400,
  bold: 700,
};

export const breakpoints = {
  tiny: 320,
  small: 375,
  medium: 425,
  double: 758, // small x 2 + gap 8
} as const;

export const graduations = {
  // From Zero
  z_tiny: [0, breakpoints.tiny],
  z_small: [0, breakpoints.small],
  z_medium: [0, breakpoints.medium],
  z_double: [0, breakpoints.double],

  // To Infinity
  tiny_i: [breakpoints.tiny + 1, Infinity],
  small_i: [breakpoints.small + 1, Infinity],
  medium_i: [breakpoints.medium + 1, Infinity],
  double_i: [breakpoints.double + 1, Infinity],
} as const;
export type TGraduationName = keyof typeof graduations;

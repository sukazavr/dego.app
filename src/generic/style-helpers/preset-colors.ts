export const PRESET_COLORS = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#436eb1',
  '#03a9f4',
  '#00d4cc',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#ff5722',
  '#795548',
  '#000',
  '#858585',
  '#D6D6D6',
  '#f2f2f2',
];

export const PRESET_COLORS_LIGHT = [
  PRESET_COLORS[7],
  PRESET_COLORS[10],
  PRESET_COLORS[11],
  PRESET_COLORS[12],
  PRESET_COLORS[13],
  PRESET_COLORS[19],
  PRESET_COLORS[20],
];

let lastIndex = 0;
export const getPresetNextColor = () => PRESET_COLORS[lastIndex++ % PRESET_COLORS.length];

export const COMPONENT_COLORS = [
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
  '#607d8b',
  '#858585',
  '#D6D6D6',
  '#f2f2f2',
];

export const COMPONENT_COLORS_LIGHT = [
  COMPONENT_COLORS[7],
  COMPONENT_COLORS[10],
  COMPONENT_COLORS[11],
  COMPONENT_COLORS[12],
  COMPONENT_COLORS[13],
  COMPONENT_COLORS[19],
  COMPONENT_COLORS[20],
];

let lastIndex = 0;
export const getComponentNextColor = () => COMPONENT_COLORS[lastIndex++ % COMPONENT_COLORS.length];

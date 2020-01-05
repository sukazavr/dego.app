import { cssRule } from 'typestyle';
import { NestedCSSProperties } from 'typestyle/lib/types';

import { canUseDOM } from './supply/env-helpers';
import { tv } from './supply/style-helpers';
import { fontWeights, monoFontFamily, regularFontFamily, themeVariables } from './tokens';

// Init
if (canUseDOM) {
  const rootStyle = window.document.documentElement.style;
  Object.entries(themeVariables).forEach(([name, val]) => {
    rootStyle.setProperty(`--${name}`, val);
  });
}

export const fontRegular: NestedCSSProperties = {
  fontFamily: regularFontFamily,
  fontStyle: 'normal',
  fontWeight: fontWeights.normal,
  fontSize: '12px',
  lineHeight: '14px',
};

export const fontRegularBig: NestedCSSProperties = {
  ...fontRegular,
  fontSize: '14px',
  lineHeight: '16px',
};

export const fontUnit: NestedCSSProperties = {
  ...fontRegular,
  fontFamily: monoFontFamily,
};

export const fontPreview: NestedCSSProperties = {
  ...fontUnit,
  fontSize: '13px',
  lineHeight: '15px',
};

export const scrollRegular: NestedCSSProperties = {
  $nest: {
    '&::-webkit-scrollbar': {
      width: '.5rem',
      height: '.5rem',
    },
    '&::-webkit-scrollbar-corner': {
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-track': {
      borderTop: `1px solid ${tv('base900')}`,
      borderLeft: `1px solid ${tv('base900')}`,
    },
    '&:hover::-webkit-scrollbar-thumb': {
      backgroundColor: tv('base900'),
    },
  },
};

cssRule('body', {
  display: 'flex',
  contain: 'strict',
  overflow: 'hidden',
  overscrollBehavior: 'none',
});

cssRule('#root', {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
});

import React from 'react';

export type TIconName = keyof typeof icons;

export const icons = {
  canvas: {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path fillRule="evenodd" d="M20 4H4v16h16V4zM3 3v18h18V3H3z" clipRule="evenodd" />,
        <path fillRule="evenodd" d="M17 7H7v10h10V7zM6 6v12h12V6H6z" clipRule="evenodd" />
      </>
    ),
  },
  div: {
    viewBox: '0 0 24 24',
    path: React.createElement('path', {
      fillRule: 'evenodd',
      clipRule: 'evenodd',
      d: 'M20 8H3v8h17V8zM2 7v10h19V7H2z',
    }),
  },
  flexRow: {
    viewBox: '0 0 24 24',
    path: React.createElement('path', {
      fillRule: 'evenodd',
      clipRule: 'evenodd',
      d: 'M8 16V8H3v8h5zm-6 1V7h19v10H2zm12-1H9V8h5v8zm1 0h5V8h-5v8z',
    }),
  },
  flexColumn: {
    viewBox: '0 0 24 24',
    path: React.createElement('path', {
      fillRule: 'evenodd',
      clipRule: 'evenodd',
      d: 'M16 9H8v5h8V9zm0-1H8V3h8v5zm1 13H7V2h10v19zm-9-6v5h8v-5H8z',
    }),
  },
  grid: {
    viewBox: '0 0 24 24',
    path: (
      <path
        fillRule="evenodd"
        d="M3 20V3h17v17H3zM4 4h7v7H4V4zm0 8v7h7v-7H4zm8 0v7h7v-7h-7zm7-1V4h-7v7h7z"
        clipRule="evenodd"
      />
    ),
  },
  component: {
    viewBox: '0 0 24 24',
    path: (
      <path
        fillRule="evenodd"
        d="M5 12a7 7 0 1 0 14 0 7 7 0 0 0-14 0zm7-8a8 8 0 1 0 0 16 8 8 0 0 0 0-16z"
        clipRule="evenodd"
      />
    ),
  },
  info: {
    viewBox: '0 0 50 50',
    path: (
      <path d="M24.5 2A5.51 5.51 0 0 0 19 7.5c0 3.03 2.47 5.5 5.5 5.5S30 10.53 30 7.5 27.53 2 24.5 2zm0 2C26.45 4 28 5.55 28 7.5S26.45 11 24.5 11A3.48 3.48 0 0 1 21 7.5C21 5.55 22.55 4 24.5 4zM15 16a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h5v16h-5a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-5V17a1 1 0 0 0-1-1zm1 2h12v23a1 1 0 0 0 1 1h5v4H16v-4h5a1 1 0 0 0 1-1V23a1 1 0 0 0-1-1h-5z" />
    ),
  },
  more: {
    viewBox: '0 0 24 24',
    path: (
      <path d="M4 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0zM10 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0zM16 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
    ),
  },
  flexShrink: {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path fillRule="evenodd" d="M21 12H3v-1h18v1z" clipRule="evenodd" />
        <path d="M13 21h-2v-4H8l4-4 4 4h-3v4zM11 2h2v4h3l-4 4-4-4h3V2z" />
      </>
    ),
  },
  flexGrow: {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path fillRule="evenodd" d="M21 21H3v-1h18v1z" clipRule="evenodd" />
        <path d="M11 11h2v4h3l-4 4-4-4h3v-4z" />
        <path d="M13 13h-2V9H8l4-4 4 4h-3v4z" />
        <path fillRule="evenodd" d="M21 4H3V3h18v1z" clipRule="evenodd" />
      </>
    ),
  },
  flexNone: {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path fillRule="evenodd" d="M21 21H3v-1h18v1z" clipRule="evenodd" />
        <path d="M18 7.2L16.8 6 12 10.8 7.2 6 6 7.2l4.8 4.8L6 16.8 7.2 18l4.8-4.8 4.8 4.8 1.2-1.2-4.8-4.8L18 7.2z" />
        <path fillRule="evenodd" d="M21 4H3V3h18v1z" clipRule="evenodd" />
      </>
    ),
  },
};

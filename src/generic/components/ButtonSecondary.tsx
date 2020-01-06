import React from 'react';
import { classes, style } from 'typestyle';

import { tv } from '../supply/style-helpers';
import { isText } from '../supply/type-guards';
import { fontRegular } from '../theme';

interface IProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  href?: string;
}

export const ButtonSecondary = React.forwardRef<HTMLButtonElement, IProps>(
  ({ href, children, className, ...rest }, ref) => {
    let element = 'button';
    const elementProps: IProps = {
      ...rest,
      ref,
      className: classes($container, className),
      children: <span className={$text}>{children}</span>,
    };
    if (isText(href)) {
      element = 'a';
      elementProps.href = href;
    } else {
      elementProps.type = 'button';
    }
    return React.createElement(element, elementProps);
  }
);

const $container = style(fontRegular, {
  display: 'block',
  padding: 0,
  height: '3.25rem',
  minWidth: '3.25rem',
  lineHeight: '3.25rem',
  backgroundColor: 'transparent',
  border: 'none',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  outline: 'none',
  userSelect: 'none',
  cursor: 'pointer',
});

const $text = style({
  padding: '0.1rem 1rem',
  backgroundColor: tv('base500'),
  border: `1px solid ${tv('base900')}`,
  borderRadius: '2px',
  color: tv('base'),
});

import React from 'react';
import { classes, style } from 'typestyle';

import { Atom } from '@grammarly/focal';

import { TElementAny } from '../../../generic/states/elements';
import { tv } from '../../../generic/supply/style-helpers';
import { isNotElementCanvas } from '../../../generic/supply/type-guards';

interface IProps {
  element$: Atom<TElementAny>;
  hasChildren: boolean;
  isExpanded: boolean;
}

export const ElementContentExpander = React.memo<IProps>(
  ({ hasChildren, isExpanded, element$ }) => {
    const toggle = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        element$.modify((_) => (isNotElementCanvas(_) ? { ..._, isExpanded: !_.isExpanded } : _));
      },
      [element$]
    );
    return (
      <div className={$container} onClick={hasChildren ? toggle : undefined}>
        {hasChildren && <div className={classes($triangle, isExpanded && $expanded)} />}
      </div>
    );
  }
);

const $container = style({
  flex: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '3rem',
  fontSize: '1.5rem',
});

const $triangle = style({
  borderWidth: '0.3076923076923077em 0.3076923076923077em 0',
  borderStyle: 'solid',
  borderColor: `${tv('base300')} transparent transparent`,
  transform: 'rotate(-90deg)',
  transitionDuration: '120ms',
  transitionProperty: 'border, transform',
});

const $expanded = style({
  transform: 'rotate(0)',
});

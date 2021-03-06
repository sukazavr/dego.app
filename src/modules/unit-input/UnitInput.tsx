import React from 'react';

import { Atom } from '@grammarly/focal';

import { Input } from '../../generic/components/Input';
import { IUnit } from '../../generic/states/unit';
import { useObservable } from '../../generic/supply/react-helpers';
import { useContextMenu } from '../context-menu/hook';
import { MenuItem } from '../context-menu/MenuItem';
import { TUnitOptionsKeys, unitOptions } from './options';
import { useUnitInputWatcher } from './watcher';

type TProps = {
  unit$: Atom<IUnit>;
  options: TUnitOptionsKeys[];
  isFull?: boolean;
};

export const UnitInput = React.memo<TProps>(({ unit$, options, isFull }) => {
  const ref = React.useRef<HTMLInputElement>(null);
  const { state$, actions } = useUnitInputWatcher([ref, unit$, options]);
  const state = useObservable(state$);
  const ctxMenu = useContextMenu(
    () => (
      <>
        {options.map((optionName) => {
          const option = unitOptions[optionName];
          const unit = unit$.get();
          return (
            <MenuItem
              key={optionName}
              children={optionName}
              isActive={option.is(unit)}
              onClick={() => unit$.set(option.convert(unit))}
            />
          );
        })}
      </>
    ),
    [unit$, options]
  );
  return (
    <Input
      ref={ref}
      maxWidth={isFull ? undefined : 's'}
      spellCheck={false}
      value={state.value}
      placeholder={state.placeholder}
      isInvalid={state.isInvalid}
      onContextMenu={ctxMenu.open({ options, unit$ })}
      {...actions}
    />
  );
});

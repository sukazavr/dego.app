import React from 'react';
import { style } from 'typestyle';

import { Atom } from '@grammarly/focal';

import { Panel } from '../../../../generic/components/Panel';
import { IElementComponentProps } from '../../../../generic/states/elements';
import { COMPONENT_COLORS } from '../../../../generic/style-helpers/component-colors';
import { useObservable } from '../../../../generic/supply/react-helpers';

interface IProps {
  componentProps$: Atom<IElementComponentProps>;
}

export const Color = React.memo<IProps>(({ componentProps$ }) => {
  const { preset$, setPreset } = React.useMemo(() => {
    const memoPreset$ = componentProps$.lens('color');
    return {
      preset$: memoPreset$,
      setPreset: (preset: IElementComponentProps['color']) => () => memoPreset$.set(preset),
    };
  }, [componentProps$]);
  const preset = useObservable(preset$);
  return (
    <>
      <Panel title="Color" isTransparent />
      <div className={$container}>
        {COMPONENT_COLORS.map((color) => (
          <div
            key={color}
            className={$color}
            style={{
              boxShadow: `${color} 0px 0px 0px ${preset === color ? 0.5 : 2}rem inset`,
            }}
            onClick={setPreset(color)}
          />
        ))}
      </div>
    </>
  );
});

const $container = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(6, 4rem)',
  gridTemplateRows: 'repeat(3, 4rem)',
  gridGap: '.5rem',
  justifyContent: 'space-between',
  padding: '1rem 1rem 2rem',
});

const $color = style({
  background: 'transparent',
  height: '100%',
  width: '100%',
  borderRadius: '50%',
  transition: 'box-shadow 100ms ease 0s',
  cursor: 'pointer',
});

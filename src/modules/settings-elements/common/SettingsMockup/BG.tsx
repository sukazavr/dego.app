import React from 'react';
import { style } from 'typestyle';

import { Atom } from '@grammarly/focal';

import { Panel } from '../../../../generic/components/Panel';
import { Switcher } from '../../../../generic/components/Switcher';
import { IElementMockupProps } from '../../../../generic/states/elements';
import { PRESET_COLORS } from '../../../../generic/style-helpers/preset-colors';
import { useObservable } from '../../../../generic/supply/react-helpers';

interface IProps {
  mockupProps$: Atom<IElementMockupProps>;
}

export const BG = React.memo<IProps>(({ mockupProps$ }) => {
  const { preset$, setPreset, hasBG$ } = React.useMemo(() => {
    const memoPreset$ = mockupProps$.lens('BGColor');
    return {
      preset$: memoPreset$,
      setPreset: (preset: IElementMockupProps['BGColor']) => () => memoPreset$.set(preset),
      hasBG$: mockupProps$.lens('hasBG'),
    };
  }, [mockupProps$]);
  const preset = useObservable(preset$);
  const hasBG = useObservable(hasBG$);
  return (
    <>
      <Panel title="Background Color" isTransparent>
        <Switcher value$={hasBG$} />
      </Panel>
      {hasBG && (
        <div className={$container}>
          {PRESET_COLORS.map((color) => (
            <div
              key={color}
              className={$color}
              style={{
                boxShadow: `${color} 0px 0px 0px ${preset === color ? 0.8 : 2}rem inset`,
              }}
              onClick={setPreset(color)}
            />
          ))}
        </div>
      )}
    </>
  );
});

const $container = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 3.25rem)',
  gridTemplateRows: 'repeat(3, 3.25rem)',
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

import React from 'react';

import { Atom } from '@grammarly/focal';

import { Button } from '../../../../generic/components/Button';
import { ButtonGroup } from '../../../../generic/components/ButtonGroup';
import { IElementComponentProps } from '../../../../generic/states/elements';
import { useObservable } from '../../../../generic/supply/react-helpers';

interface IProps {
  componentProps$: Atom<IElementComponentProps>;
}

export const Tag = React.memo<IProps>(({ componentProps$ }) => {
  const { preset$, setPreset } = React.useMemo(() => {
    const memoPreset$ = componentProps$.lens('tag');
    return {
      preset$: memoPreset$,
      setPreset: (preset: IElementComponentProps['tag']) => () => memoPreset$.set(preset),
    };
  }, [componentProps$]);
  const preset = useObservable(preset$);
  return (
    <ButtonGroup style={{ padding: '1rem' }}>
      <Button isActive={preset === 'div'} onClick={setPreset('div')} children="div" />
      <Button isActive={preset === 'button'} onClick={setPreset('button')} children="button" />
      <Button isActive={preset === 'img'} onClick={setPreset('img')} children="img" />
    </ButtonGroup>
  );
});

import React from 'react';
import { style } from 'typestyle';

import { Button } from '../../../generic/components/Button';
import { ButtonGroup } from '../../../generic/components/ButtonGroup';
import { Label } from '../../../generic/components/Label';
import { Panel } from '../../../generic/components/Panel';
import { Stack } from '../../../generic/components/Stack';
import { Switcher } from '../../../generic/components/Switcher';
import { Tandem } from '../../../generic/components/Tandem';
import { TandemGroup } from '../../../generic/components/TandemGroup';
import { ECanvasType, lensElementCanvas } from '../../../generic/states/elements';
import { stateElements$ } from '../../../generic/states/state-app';
import { useObservableFabric } from '../../../generic/supply/react-helpers';
import { scrollRegular } from '../../../generic/theme';
import { UnitInput } from '../../unit-input/UnitInput';
import { useSettingsCanvasWatcher } from './watcher';

export const SettingsCanvas = React.memo(() => {
  const { changeType } = useSettingsCanvasWatcher();
  const props = React.useMemo(() => {
    const canvas$ = stateElements$.lens(lensElementCanvas);
    return {
      width$: canvas$.lens('width'),
      height$: canvas$.lens('height'),
      isTransparent$: canvas$.lens('isTransparent'),
    };
  }, []);
  const canvasType = useObservableFabric(
    () => stateElements$.view(lensElementCanvas).view('type'),
    []
  );
  return (
    <div className={$container}>
      <div className={$wrapper}>
        <ButtonGroup style={{ padding: '1rem' }}>
          <Button
            icon="div"
            isActive={canvasType === ECanvasType.Div}
            onClick={changeType._(ECanvasType.Div)}
          />
          <Button
            icon="flexRow"
            isActive={canvasType === ECanvasType.FlexRow}
            onClick={changeType._(ECanvasType.FlexRow)}
          />
          <Button
            icon="flexColumn"
            isActive={canvasType === ECanvasType.FlexColumn}
            onClick={changeType._(ECanvasType.FlexColumn)}
          />
        </ButtonGroup>
        <Panel title="Background" />
        <TandemGroup>
          <Tandem
            left={<Label children="Transparent" />}
            right={<Switcher value$={props.isTransparent$} />}
          />
        </TandemGroup>
        <Panel title="Size" />
        <TandemGroup>
          <Tandem
            left={
              <Stack spacing={1} isInline>
                <Label children="W" />
                <UnitInput options={['px']} unit$={props.width$} />
              </Stack>
            }
            right={
              <Stack spacing={1} isInline>
                <Label children="H" />
                <UnitInput options={['px']} unit$={props.height$} />
              </Stack>
            }
          />
        </TandemGroup>
      </div>
    </div>
  );
});

const $container = style(scrollRegular, {
  overflow: 'auto',
});

const $wrapper = style({
  minWidth: '180px',
});

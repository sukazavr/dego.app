import React from 'react';
import { style } from 'typestyle';

import { Button } from '../../../generic/components/Button';
import { ButtonGroup } from '../../../generic/components/ButtonGroup';
import { Label } from '../../../generic/components/Label';
import { Panel } from '../../../generic/components/Panel';
import { Switcher } from '../../../generic/components/Switcher';
import { Tandem } from '../../../generic/components/Tandem';
import { TandemGroup } from '../../../generic/components/TandemGroup';
import { ECanvasType, lensElementCanvas } from '../../../generic/states/elements';
import { stateElements$ } from '../../../generic/states/state-app';
import { useObservableFabric } from '../../../generic/supply/react-helpers';
import { scrollRegular } from '../../../generic/theme';
import { TooltipProvider } from '../../tooltip/TooltipProvider';
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
      isBorderless$: canvas$.lens('isBorderless'),
    };
  }, []);
  const canvasType = useObservableFabric(
    () => stateElements$.view(lensElementCanvas).view('type'),
    []
  );
  return (
    <div className={$container}>
      <div className={$wrapper}>
        <TooltipProvider />
        <ButtonGroup style={{ padding: '1rem' }}>
          <Button
            icon="div"
            isActive={canvasType === ECanvasType.Div}
            onClick={changeType._(ECanvasType.Div)}
            data-tip="regular div, no flex"
            data-place="bottom"
          />
          <Button
            icon="flexRow"
            isActive={canvasType === ECanvasType.FlexRow}
            onClick={changeType._(ECanvasType.FlexRow)}
            data-tip="flex-direction: row"
            data-place="bottom"
          />
          <Button
            icon="flexColumn"
            isActive={canvasType === ECanvasType.FlexColumn}
            onClick={changeType._(ECanvasType.FlexColumn)}
            data-tip="flex-direction: column"
            data-place="bottom"
          />
        </ButtonGroup>
        <Panel title="Appearance" />
        <TandemGroup>
          <Tandem
            left={<Label children="Transparent" />}
            right={<Switcher value$={props.isTransparent$} />}
          />
          <Tandem
            left={<Label children="Borderless" />}
            right={<Switcher value$={props.isBorderless$} />}
          />
        </TandemGroup>
        <Panel title="Size" />
        <TandemGroup>
          <Tandem
            left={
              <Tandem
                left={<Label children="Width" />}
                right={<UnitInput options={['px']} unit$={props.width$} />}
                leftMax={46}
              />
            }
            right={
              <Tandem
                left={<Label children="Height" />}
                right={<UnitInput options={['px']} unit$={props.height$} />}
                leftMax={46}
              />
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

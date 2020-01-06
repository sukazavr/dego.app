import React from 'react';
import { style } from 'typestyle';

import { Button } from '../../generic/components/Button';
import { ButtonGroup } from '../../generic/components/ButtonGroup';
import { ButtonSecondary } from '../../generic/components/ButtonSecondary';
import { Panel } from '../../generic/components/Panel';
import { BODY_ID } from '../../generic/states/elements';
import { EExportLayout } from '../../generic/states/export';
import { stateExport$ } from '../../generic/states/state-app';
import { useObservable } from '../../generic/supply/react-helpers';
import { isNotNull } from '../../generic/supply/type-guards';
import { scrollRegular } from '../../generic/theme';

export const ExportSettings = React.memo(() => {
  const { toggle, setLayout } = React.useMemo(() => {
    return {
      toggle: () => stateExport$.lens('targetID').modify((_) => (isNotNull(_) ? null : BODY_ID)),
      setLayout: (preset: EExportLayout) => () => stateExport$.lens('layout').set(preset),
    };
  }, []);
  const { targetID, layout } = useObservable(stateExport$);
  const isOpen = isNotNull(targetID);
  return (
    <div className={$container} style={{ height: isOpen ? '300px' : undefined }}>
      <div className={$wrapper}>
        <Panel title="Export" onClick={toggle}>
          {isOpen && <ButtonSecondary children="Back To Editor" />}
        </Panel>
        <div className={$settings}>
          {isOpen && (
            <ButtonGroup style={{ padding: '1rem' }}>
              <Button
                children="HTML"
                isActive={layout === EExportLayout.HTML}
                onClick={setLayout(EExportLayout.HTML)}
              />
              <Button
                children="JSX"
                isActive={layout === EExportLayout.JSX}
                onClick={setLayout(EExportLayout.JSX)}
              />
            </ButtonGroup>
          )}
        </div>
      </div>
    </div>
  );
});

const $container = style(scrollRegular, {
  display: 'flex',
  flexDirection: 'column',
  height: '4rem',
  transition: 'height 0.12s cubic-bezier(0.23, 1, 0.32, 1)',
  overflow: 'auto',
});

const $wrapper = style({
  minWidth: '170px',
});

const $settings = style({
  flex: '1 0 0',
});

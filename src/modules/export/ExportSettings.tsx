import React from 'react';
import { style } from 'typestyle';

import { actionsExport } from '../../generic/actions';
import { Button } from '../../generic/components/Button';
import { ButtonGroup } from '../../generic/components/ButtonGroup';
import { ButtonSecondary } from '../../generic/components/ButtonSecondary';
import { Panel } from '../../generic/components/Panel';
import { Switcher } from '../../generic/components/Switcher';
import { EExportLayout } from '../../generic/states/export';
import { stateTree$ } from '../../generic/states/state-app';
import { useObservable, useObservableFabric } from '../../generic/supply/react-helpers';
import { isNotNull } from '../../generic/supply/type-guards';
import { scrollRegular } from '../../generic/theme';
import { useExportSettingsWatcher } from './watcher-settings';

export const ExportSettings = React.memo(() => {
  const { settings$, setLayout } = useExportSettingsWatcher();
  const { eliminateEmptyCSSRules$ } = React.useMemo(() => {
    return {
      eliminateEmptyCSSRules$: settings$.lens('eliminateEmptyCSSRules'),
    };
  }, [settings$]);
  const { layout } = useObservable(settings$);
  const isOpen = useObservableFabric(() => stateTree$.view('exportedID').view(isNotNull), []);
  return (
    <div className={$container} style={{ height: isOpen ? '300px' : undefined }}>
      <div className={$wrapper}>
        <Panel title="Export" onClick={actionsExport.toggle}>
          {isOpen && <ButtonSecondary children="Back To Editor" />}
        </Panel>
        <div className={$settings}>
          {isOpen && (
            <>
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
              <Panel title="Eliminate empty CSS-rules" isTransparent>
                <Switcher value$={eliminateEmptyCSSRules$} />
              </Panel>
            </>
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

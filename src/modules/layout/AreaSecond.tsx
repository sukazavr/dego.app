import React from 'react';

import { CANVAS_ID } from '../../generic/states/elements';
import { stateTree$ } from '../../generic/states/state-app';
import { useObservableFabric } from '../../generic/supply/react-helpers';
import { SettingsCanvas } from '../settings-canvas/SettingsCanvas';

export const AreaSecond = React.memo(() => {
  const focusedID = useObservableFabric(() => stateTree$.view('focusedID'), []);
  if (focusedID === CANVAS_ID) {
    return <SettingsCanvas />;
  }
  return null;
});

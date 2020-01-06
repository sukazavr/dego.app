import React from 'react';

import { CANVAS_ID } from '../../generic/states/elements';
import { stateTree$ } from '../../generic/states/state-app';
import { useObservableFabric } from '../../generic/supply/react-helpers';
import { isNull } from '../../generic/supply/type-guards';
import { SettingsCanvas } from '../settings-elements/element-canvas/SettingsCanvas';
import { SettingsGeneric } from '../settings-elements/element-generic/SettingsGeneric';

export const AreaSecond = React.memo(() => {
  const focusedID = useObservableFabric(() => stateTree$.view('focusedID'), []);
  if (isNull(focusedID)) {
    return null;
  } else {
    if (focusedID === CANVAS_ID) {
      return <SettingsCanvas />;
    } else {
      return <SettingsGeneric elementID={focusedID} />;
    }
  }
});

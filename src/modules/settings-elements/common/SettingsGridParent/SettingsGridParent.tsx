import React from 'react';

import { Alert } from '../../../../generic/components/Alert';
import { Panel } from '../../../../generic/components/Panel';

export const SettingsGridParent = React.memo(() => {
  return (
    <>
      <Panel title="Grid Parent" />
      <Alert icon="info" text="Not yet implemented" />
    </>
  );
});

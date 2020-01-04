import React from 'react';

import { Alert } from '../../../../generic/components/Alert';
import { Panel } from '../../../../generic/components/Panel';

export const SettingsGridChild = React.memo(() => {
  return (
    <>
      <Panel title="Grid Child" />
      <Alert icon="info" text="Not yet implemented" />
    </>
  );
});

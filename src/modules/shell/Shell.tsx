import React from 'react';

import { ContextMenuProvider } from '../context-menu/ContextMenuProvider';
import { GlobalSettingsProvider } from '../global-notifications/GlobalNotificationsProvider';
import { Layout } from '../layout/Layout';

export const Shell: React.FC = () => {
  return (
    <>
      <Layout />
      <ContextMenuProvider />
      <GlobalSettingsProvider />
    </>
  );
};

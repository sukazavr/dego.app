import React from 'react';

import { ContextMenuProvider } from '../context-menu/ContextMenuProvider';
import { Layout } from '../layout/Layout';

export const Shell: React.FC = () => {
  return (
    <>
      <Layout />
      <ContextMenuProvider />
    </>
  );
};

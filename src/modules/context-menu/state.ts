import React from 'react';

import { ca } from '../../generic/supply/action-helpers';

export const closeContextMenu = ca();
export const sendToContextMenuProvider = ca<IContextMenuPayload>();

export interface IContextMenuPayload {
  node: React.ReactNode;
  position: { left: number; top: number };
}

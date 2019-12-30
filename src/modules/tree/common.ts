import React from 'react';

import { ca } from '../../generic/supply/action-helpers';

export const elStore = new Map<string, HTMLDivElement>();

export const treeElementStartDragging = ca<string>();
export const treeElementEndDragging = ca();
export const treeElementSetTarget = ca<string>();
export const treeElementOnDrag = ca<React.DragEvent<HTMLDivElement>>();

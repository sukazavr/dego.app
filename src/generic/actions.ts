import { CANVAS_ID } from './states/elements';
import { ca, ga } from './supply/action-helpers';

export const actionsTree = ga('tree', {
  addInside: ca<{ parentID: string }>(),
  addAbove: ca<{ neighborID: string }>(),
  addBelow: ca<{ neighborID: string }>(),
  duplicate: ca<{ id: string }>(),
  delete: ca<{ id: string }>(),
  focus: ca<{ id: string }>(),
  editName: ca<{ id: string }>((R, payload) => {
    if (payload.id !== CANVAS_ID) {
      R(payload);
    }
  }),
});

export const actionsExport = ga('export', {
  toggle: ca(),
  open: ca<{ exportedID: string }>(),
});

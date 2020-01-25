import { toast, ToastContent, ToastId, ToastOptions, TypeOptions } from 'react-toastify';

import { CANVAS_ID } from './states/elements';
import { ca, ga } from './supply/action-helpers';

export const actionsTree = ga('tree', {
  addInside: ca<{ parentID: string }>(),
  addAbove: ca<{ neighborID: string }>(),
  addBelow: ca<{ neighborID: string }>(),
  duplicate: ca<{ id: string }>(),
  delete: ca<{ id: string }>(),
  deleteChildren: ca<{ id: string }>(),
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

interface IGlobalNotificationPayload {
  content: ToastContent;
  options?: ToastOptions;
}

const caToast = (type: TypeOptions = 'default') =>
  ca<IGlobalNotificationPayload, IGlobalNotificationPayload, ToastId>((R, payload) => {
    const toastID = toast(payload.content, { ...payload.options, type });
    R(payload);
    return toastID;
  });

export const actionsGlobalNotifications = ga('global-notifications', {
  show: caToast(),
  error: caToast('error'),
  info: caToast('info'),
  success: caToast('success'),
  warning: caToast('warning'),
  hide: ca<{ id: string }>(),
});

import 'react-toastify/dist/ReactToastify.min.css';

import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { filter, take, takeUntil } from 'rxjs/operators';
import { style } from 'typestyle';

import { actionsGlobalNotifications } from '../../generic/actions';
import { stateShell$ } from '../../generic/states/state-app';
import { createSharedProvider, createUseWatcher } from '../../generic/supply/react-helpers';
import { tv } from '../../generic/supply/style-helpers';
import { fontRegularBig } from '../../generic/theme';

export const GlobalSettingsProvider = createSharedProvider(() => {
  useWatcher();
  return <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} className={$container} />;
});

const $container = style({
  $nest: {
    '& .Toastify__toast': fontRegularBig,
    '& .Toastify__toast--default': {
      color: tv('base900'),
    },
  },
});

const useWatcher = createUseWatcher(({ didUnmount$ }) => {
  stateShell$
    .view('isReadyForOffline')
    .pipe(filter(Boolean), take(1), takeUntil(didUnmount$))
    .subscribe(actionsGlobalNotifications.info._({ content: 'App is ready to work offline 🤍' }));
});

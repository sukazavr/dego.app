import { stateShell$ } from '../../generic/states/state-app';
import { registerServiceWorker } from './service-worker';

registerServiceWorker({
  onSuccess: () => {
    stateShell$.lens('isReadyForOffline').set(true);
  },
  onUpdate: () => {
    stateShell$.lens('isUpdateAvailable').set(true);
  },
});

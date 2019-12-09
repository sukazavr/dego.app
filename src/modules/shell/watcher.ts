import { stateShell$ } from '../../generic/states/state-app'
import { createUseWatcher } from '../../generic/supply/react-helpers'
import { registerServiceWorker } from './service-worker'

export const useShellWatcher = createUseWatcher(() => {
	registerServiceWorker({
		onSuccess: () => {
			stateShell$.lens('isReadyForOffline').set(true)
		},
		onUpdate: () => {
			stateShell$.lens('isUpdateAvailable').set(true)
		},
	})
})

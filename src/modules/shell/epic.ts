import { stateShell$ } from '../../generic/states/state-app'
import { createUseEpic } from '../../generic/supply/react-helpers'
import { registerServiceWorker } from './service-worker'

export const useShellEpic = createUseEpic((didMount) => {
	registerServiceWorker({
		onSuccess: () => {
			stateShell$.lens('isReadyForOffline').set(true)
		},
		onUpdate: () => {
			stateShell$.lens('isUpdateAvailable').set(true)
		},
	})

	didMount(() => [])
})

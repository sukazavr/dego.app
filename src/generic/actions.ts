import { ca, ga } from './supply/action-helpers';

export const actionsAuth = ga('auth', {
	login: ca<{ key: string }>(),
	logout: ca(),
})

// tslint:disable-next-line:interface-name
declare interface Window {
	__REDUX_DEVTOOLS_EXTENSION__?: any
}

declare module 'nanoid' {
	const nanoid: (v?: number) => string
	export default nanoid
}

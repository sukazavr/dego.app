export const canUseDOM = !!(
	typeof window !== 'undefined' &&
	window.document &&
	window.document.createElement
)

export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelopment = !isProduction

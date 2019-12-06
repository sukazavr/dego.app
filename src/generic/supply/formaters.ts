export const stringToSlug = (str: string) => str.replace(/\s+/g, '-').toLowerCase()

export const slugToTitle = (slug: string) =>
	slug.replace('-', ' ').replace(/^./, (str) => str.toUpperCase())

export const mapToQuery = (map?: Record<string, string | number>) => {
	let q: string = ''
	if (map) {
		q = Object.entries(map)
			.map((v) => v.join('='))
			.join('&')
	}
	return q ? `?${q}` : q
}

export const cleanOptionals = (obj: any, optionals: string[]) =>
	optionals.reduce(
		(acc, optional) => {
			const value = acc[optional]
			if ((typeof value === 'string' && value.trim() === '') || value === undefined) {
				delete acc[optional]
			}
			return acc
		},
		{ ...obj }
	)

export const formatDate = (date: Date) => {
	let hours = date.getHours()
	let minutes: any = date.getMinutes()
	const ampm = hours >= 12 ? 'pm' : 'am'
	hours = hours % 12
	hours = hours ? hours : 12 // the hour '0' should be '12'
	minutes = minutes < 10 ? '0' + minutes : minutes
	const strTime = hours + ':' + minutes + ' ' + ampm
	return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + strTime
}

export const isArrayEqual = (a: any[], b: any[]) => {
	if (a === b) {
		return true
	}

	if (a.length === b.length) {
		for (let i = 0, l = a.length; i < l; ++i) {
			if (a[i] !== b[i]) {
				return false
			}
		}
		return true
	}

	return false
}

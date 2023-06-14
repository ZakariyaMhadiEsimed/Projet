import deepmerge from 'deepmerge'

export default function extendUpdate(update: any): unknown {
	update.extend('$auto', (value: any, object: any): unknown => {
		return object ? update(object, { $merge: deepmerge(object, value) }) : update({}, { $merge: value })
	})

	update.extend('$autoArray', (value: any, object: any): unknown => {
		const arrValue = Object.keys(value).reduce((arr: any, key) => {
			arr[key] = value[key]
			return arr
		}, [])

		return object ? update(object, { $merge: deepmerge(object, arrValue) }) : update([], { $merge: arrValue })
	})

	return update
}

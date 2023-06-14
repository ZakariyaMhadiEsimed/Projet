const allReplace = (string: string, regex: string, newString: string): string => {
	const reg = new RegExp(regex, 'g')
	return string.replace(reg, newString)
}

export default allReplace

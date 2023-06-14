interface tokenObjFormat {
	header: any
	body: any
	tail: any
}

class Base64Format {

	static keyDecode(key: string): any {
		return JSON.parse(atob(key))
	}

	static keyEncode(key: string): string {
		return btoa(key)
	}

	static splitToken(token: string): tokenObjFormat {
		const tokenSplit = token.split('.')
		const tokenObjFormat = {
			header: this.keyDecode(tokenSplit[0]),
			body: this.keyDecode(tokenSplit[1]),
			tail: tokenSplit[2],
		}
		return tokenObjFormat
	}
}

export default Base64Format

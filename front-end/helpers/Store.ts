import { isUndefined } from 'lodash'
class Store {
	static get(key: string): any {
		//const storedKey = localStorage.getItem(key)
		const cookieObj: Record<string, any> = document.cookie.split(';').reduce((res, c) => {
			const [key, val] = c.trim().split('=').map(decodeURIComponent)
			try {
				return Object.assign(res, { [key]: JSON.parse(val) })
			} catch (e) {
				return Object.assign(res, { [key]: val })
			}
		}, {})
		if (!isUndefined(cookieObj[key]?.authenticationToken)) {
			return cookieObj[key]
		}
		if (!isUndefined(cookieObj[key]?.idLanguage)) {
			return cookieObj[key]
		}
		/*if (typeof storedKey === 'string') {
			return JSON.parse(storedKey)
		}*/
	}

	static set(key: string, value: unknown): void {
		localStorage.setItem(key, JSON.stringify(value))
		document.cookie = `${key}=${JSON.stringify(value)}`
	}

	static remove(key: string): void {
		localStorage.removeItem(key)
		document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`
	}
}

export default Store

/* abstract class Store {
	private readonly storage: IStorage

	public constructor(getStorage: any) {
		this.storage = getStorage
	}

	protected get(key: string): string {
		return JSON.parse(this.storage.getItem(key))
	}

	protected set(key: string, value: string): void {
		this.storage.setItem(key, value)
	}

	protected clearItem(key: string): void {
		this.storage.removeItem(key)
	}

	protected clearItems(keys: string[]): void {
		keys.forEach((key): void => this.clearItem(key))
	}
}

export default class Tokens extends Store {
	private static instance?: Tokens

	private constructor(arg: any) {
		super(arg)
	}

	public static getInstance(windowObject: any): Tokens {
		if (!this.instance) {
			this.instance = new Tokens(windowObject)
		}

		return this.instance
	}

	public getAccessToken(): any | null {	
		return this.get('user')
	}

	public setAccessToken(accessToken: any): void {
		console.log('this',this);
		this.set('user', accessToken)
	}

	public getRefreshToken(): any | null {
		return this.get('user')
	}

	public setRefreshToken(refreshToken: any): void {
		this.set('user', refreshToken)
	}

	public clearSingle(): void {
		this.clearItem('user')
	}

	public clear(): void {
		this.clearItems(['user'])
	}
}
 */

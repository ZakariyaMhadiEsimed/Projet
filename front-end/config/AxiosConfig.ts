////////LIBRARY/////////
import axios, { AxiosInstance } from 'axios'

const uriChecker = (): string => {
	let URI = ''
	switch (process.env.NEXT_PUBLIC_REACT_APP_TARGET) {
		case 'development':
			URI = `${process.env.NEXT_DEV_ENV_TARGET === 'development' ? 'http://localhost:8081' : ''}/cw`
			break
		// TODO : URL has to be determined for next cases
		case 'recette':
			URI = `${process.env.NEXT_DEV_ENV_TARGET === 'development' ? 'http://localhost:8081' : ''}/cw`
			break
		case 'pre-recette':
			URI = `${process.env.NEXT_DEV_ENV_TARGET === 'development' ? 'http://localhost:8081' : ''}/cw`
			break
		case 'production':
			URI = `${process.env.NEXT_DEV_ENV_TARGET === 'development' ? 'http://localhost:8081' : ''}/cw`
			break
	}
	return URI
}

export function API_TOKEN(token: string): AxiosInstance {
	const urlCaller = axios.create({
		baseURL: `${uriChecker()}`,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	})
	return urlCaller
}

export function API_TOKEN_DL_FILE(token: string): AxiosInstance {
	const urlCaller = axios.create({
		baseURL: `${uriChecker()}`,
		responseType: 'blob',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	return urlCaller
}

export const API = axios.create({
	baseURL: `${uriChecker()}`,
	headers: {
		'Access-Control-Allow-Credentials': true,
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
		'Access-Control-Allow-Headers':
			'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
	},
})

export default API_TOKEN
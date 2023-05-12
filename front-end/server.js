const express = require('express')
const next = require('next')
const { createProxyMiddleware } = require('http-proxy-middleware')

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production' || process.env.APP_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const apiPaths = {
	development: {
		target: 'http://localhost:3001',
		changeOrigin: true,
	},
}

app.prepare()
	.then(() => {
		const server = express()
		switch (process.env.NODE_ENV || process.env.APP_ENV) {
			case 'development':
				server.use('/cw', createProxyMiddleware(apiPaths['development']))
				break
			default:
				server.use('/webapi', createProxyMiddleware(apiPaths['development']))
				break
		}

		server.all('*', (req, res) => {
			return handle(req, res)
		})

		server.listen(port, (err) => {
			if (err) throw err
			console.log(`> Ready on http://localhost:${port}`)
		})
	})
	.catch((err) => {
		console.log('Error:::::', err)
	})

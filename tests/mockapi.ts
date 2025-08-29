import nock from 'nock'

export const mockApi = () => {
	nock('http://api.com')
		.get('/api/get')
		.reply(200, { r: 'get1' })

		.get('/api/john')
		.reply(200, { r: 'get2' })

		.get('/api/david')
		.reply(200, { r: 'get3' }, { 'Test-Header': 'david123' })

		.post('/api/post')
		.reply(200, { r: 'post' })

		.put('/api/put')
		.reply(200, { r: 'put' })

		.patch('/api/patch')
		.reply(200, { r: 'patch' })

		.delete('/api/delete')
		.reply(200, { r: 'delete' })

		.head('/api/head')
		.reply(200, { r: 'head' })

		.options('/api/options')
		.reply(200, { r: 'options' })

		.intercept('/api/trace', 'TRACE')
		.reply(200, { r: 'trace' })

		.intercept('/api/connect', 'CONNECT')
		.reply(200, { r: 'connect' })

		.intercept('/api/custom', 'CUSTOM')
		.reply(200, { r: 'custom' })

		.get('/api/globalheader')
		.matchHeader('Custom-Header', 'Global')
		.reply(200, { r: 'globalheaders' })

		.get('/api/serviceheader')
		.matchHeader('Custom-Header', 'Service')
		.reply(200, { r: 'serviceheaders' })

		.get('/api/methodheader')
		.matchHeader('Custom-Header', 'Overridden')
		.reply(200, { r: 'methodheaders' })

		.get('/api/serviceconfig')
		.matchHeader('Axios-Config-Header', 'Service')
		.reply(200, { r: 'serviceconfig' })

		.post('/api/methodconfig')
		.reply(200, { r: 'methodconfig' })

		.get('/api/timeout')
		.delay(500)
		.reply(200, { r: 'timeout' })
		.persist()

		// Auth test endpoints
		.get('/api/bearer-auth')
		.matchHeader('Authorization', 'Bearer test-token-123')
		.reply(200, { r: 'bearer-success' })

		.get('/api/basic-auth')
		.matchHeader('Authorization', (value) => {
			// Basic auth encodes username:password in base64
			const expected = Buffer.from('testuser:testpass').toString('base64')
			return value === `Basic ${expected}`
		})
		.reply(200, { r: 'basic-success' })

		.get('/api/apikey-auth')
		.matchHeader('X-API-Key', 'secret-api-key')
		.reply(200, { r: 'apikey-success' })

		// Content-Type test endpoints
		.post('/api/json-content')
		.matchHeader('Content-Type', 'application/json')
		.reply(200, { r: 'json-content-success' })

		.post('/api/xml-content')
		.matchHeader('Content-Type', 'application/xml')
		.reply(200, { r: 'xml-content-success' })

		.post('/api/form-content')
		.matchHeader('Content-Type', 'application/x-www-form-urlencoded')
		.reply(200, { r: 'form-content-success' })

		// Base URL test endpoint
		.get('/different-api/custom-base')
		.reply(200, { r: 'custom-base-success' })

		// Query params test endpoint
		.get('/api/query-test')
		.query({ static: 'value', another: 'param' })
		.reply(200, { r: 'query-params-success' })

		// Expected status test endpoints
		.get('/api/status-201')
		.reply(201, { r: 'status-201-success' })

		.get('/api/status-400')
		.reply(400, { error: 'bad request' })

		// Service-level decorator test endpoints
		.get('/api/bearer-auth')
		.query({ globalParam: 'globalValue' })
		.matchHeader('Authorization', 'Bearer service-token-456')
		.matchHeader('Content-Type', 'application/json')
		.reply(200, { r: 'service-bearer-success' })

		.get('/api/json-content')
		.query({ globalParam: 'globalValue' })
		.matchHeader('Content-Type', 'application/json')
		.matchHeader('Authorization', 'Bearer service-token-456')
		.reply(200, { r: 'service-json-success' })

		.get('/api/query-test')
		.query({ globalParam: 'globalValue' })
		.matchHeader('Authorization', 'Bearer service-token-456')
		.matchHeader('Content-Type', 'application/json')
		.reply(200, { r: 'service-query-success' })

	nock('https://secure-api.com')
		.get('/secure-api/get-sec')
		.reply(200, { r: 'get1-secure' })

	nock('http://different-host.com')
		.get('/different-api/custom-base')
		.reply(200, { r: 'custom-base-success' })
}

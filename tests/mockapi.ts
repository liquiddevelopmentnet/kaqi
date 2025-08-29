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

	nock('https://secure-api.com')
		.get('/secure-api/get-sec')
		.reply(200, { r: 'get1-secure' })

	// OAuth2 token endpoint
	nock('http://auth.com')
		.post('/oauth/token')
		.reply(200, {
			access_token: 'test-access-token',
			token_type: 'Bearer',
			expires_in: 3600,
			scope: 'read write',
		})
		.persist()

	// OAuth2 protected endpoints
	nock('http://api.com')
		.get('/oauth-api/protected')
		.matchHeader('Authorization', 'Bearer test-access-token')
		.reply(200, { r: 'protected-data' })

		.get('/oauth-api/public')
		.reply(200, { r: 'public-data' })

		.post('/oauth-api/scoped')
		.matchHeader('Authorization', 'Bearer test-access-token')
		.reply(200, { r: 'scoped-data' })

	// OAuth2 error scenarios
	nock('http://auth.com')
		.post('/oauth/token-error')
		.reply(400, { error: 'invalid_client' })
		.persist()
}

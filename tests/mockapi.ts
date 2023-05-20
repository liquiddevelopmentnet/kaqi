import nock from 'nock'

export const mockApi = () => {
	nock('http://api.com')
		.get('/api/get')
		.reply(200, { r: 'get1' })

		.get('/api/john')
		.reply(200, { r: 'get2' })

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

	nock('https://secure-api.com')
		.get('/secure-api/get-sec')
		.reply(200, { r: 'get1-secure' })
}

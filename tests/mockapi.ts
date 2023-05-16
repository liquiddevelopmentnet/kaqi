import nock from 'nock'

export const mockApi = () => {
	nock('http://api.com')
		.get('/api/get')
		.reply(200, { foo: 'get1' })

		.get('/api/john')
		.reply(200, { foo: 'get2' })

		.post('/api/post')
		.reply(200, { foo: 'post' })

		.put('/api/put')
		.reply(200, { foo: 'put' })

		.patch('/api/patch')
		.reply(200, { foo: 'patch' })

		.delete('/api/delete')
		.reply(200, { foo: 'delete' })

		.head('/api/head')
		.reply(200, { foo: 'head' })

		.options('/api/options')
		.reply(200, { foo: 'options' })

		.intercept('/api/trace', 'TRACE')
		.reply(200, { foo: 'trace' })

		.intercept('/api/connect', 'CONNECT')
		.reply(200, { foo: 'connect' })

		.intercept('/api/custom', 'CUSTOM')
		.reply(200, { foo: 'custom' })

		.get('/api/globalheader')
		.matchHeader('Custom-Header', 'Global')
		.reply(200, { foo: 'globalheaders' })

		.get('/api/serviceheader')
		.matchHeader('Custom-Header', 'Service')
		.reply(200, { foo: 'serviceheaders' })

		.get('/api/methodheader')
		.matchHeader('Custom-Header', 'Overridden')
		.reply(200, { foo: 'methodheaders' })

	nock('https://secure-api.com')
		.get('/secure-api/get-sec')
		.reply(200, { foo: 'get1-secure' })
}

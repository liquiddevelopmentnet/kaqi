import { expect } from 'chai'
import nock from 'nock'
import { Service, GET, UrlSuffix, Hook, POST, PUT, PATCH, DELETE, HEAD, OPTIONS, TRACE, CONNECT, CUSTOM, ServiceBuilder } from '..'

describe('Decorators', () => {
	@UrlSuffix('/api')
	class TestService extends Service {
		@GET('/get')
		async test() { }

		@GET('/get2')
		async test2() { }

		@Hook('test2')
		private hook() {
			return {
				foo: 'bar'
			}
		}

		@POST('/post')
		async test3() { }

		@PUT('/put')
		async test4() { }

		@PATCH('/patch')
		async test5() { }

		@DELETE('/delete')
		async test6() { }

		@HEAD('/head')
		async test7() { }

		@OPTIONS('/options')
		async test8() { }

		@TRACE('/trace')
		async test9() { }

		@CONNECT('/connect')
		async test10() { }

		@CUSTOM('CUSTOM', '/custom')
		async test11() { }
	}
	nock('http://api.com')
		.get('/api/get')
		.reply(200, { foo: 'get1' })
		.get('/api/get2')
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

	const service = new ServiceBuilder()
		.setEndpoint('api.com')
		.setSecure(false)
		.build(TestService)

	it('UrlSuffix', () => {
		expect(TestService.prototype._pre_p_props.suffix).to.equal('/api')
	})

	it('Hook', async () => {
		const result = await service.test2()
		expect(result).to.deep.equal({ foo: 'bar' })
	})

	it('GET', async () => {
		const result = await service.test()
		expect(result).to.deep.equal({ foo: 'get1' })
	})

	it('POST', async () => {
		const result = await service.test3()
		expect(result).to.deep.equal({ foo: 'post' })
	})

	it('PUT', async () => {
		const result = await service.test4()
		expect(result).to.deep.equal({ foo: 'put' })
	})

	it('PATCH', async () => {
		const result = await service.test5()
		expect(result).to.deep.equal({ foo: 'patch' })
	})

	it('DELETE', async () => {
		const result = await service.test6()
		expect(result).to.deep.equal({ foo: 'delete' })
	})

	it('HEAD', async () => {
		const result = await service.test7()
		expect(result).to.deep.equal({ foo: 'head' })
	})

	it('OPTIONS', async () => {
		const result = await service.test8()
		expect(result).to.deep.equal({ foo: 'options' })
	})

	it('TRACE', async () => {
		const result = await service.test9()
		expect(result).to.deep.equal({ foo: 'trace' })
	})

	it('CONNECT', async () => {
		const result = await service.test10()
		expect(result).to.deep.equal({ foo: 'connect' })
	})

	it('Custom', async () => {
		const result = await service.test11()
		expect(result).to.deep.equal({ foo: 'custom' })
	})
})
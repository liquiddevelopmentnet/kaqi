import { expect } from 'chai'
import { mockApi } from './mockapi'
import {
	TestService,
	secureTestService,
	testService,
	withoutHeadersService,
} from './services'

mockApi()

describe('Utility Decorators', () => {
	it('`@Transient` Decorator', async () => {
		const result = await testService.transient()
		expect(result).to.equal('transient function')
	})

	it('`@UrlSuffix` Decorator', () => {
		expect(TestService.prototype._pre_p_props.suffix).to.equal('/api')
	})

	it('`@Hook` Decorator', async () => {
		const result = await testService.john()
		expect(result).to.deep.equal({ foo: 'bar' })
	})
})

describe('HTTP Method Decorators', () => {
	it('`@GET` Decorator', async () => {
		const result = await testService.get()
		expect(result).to.deep.equal({ foo: 'get1' })
	})

	it('`@POST` Decorator', async () => {
		const result = await testService.post()
		expect(result).to.deep.equal({ foo: 'post' })
	})

	it('`@PUT` Decorator', async () => {
		const result = await testService.put()
		expect(result).to.deep.equal({ foo: 'put' })
	})

	it('`@PATCH` Decorator', async () => {
		const result = await testService.patch()
		expect(result).to.deep.equal({ foo: 'patch' })
	})

	it('`@DELETE` Decorator', async () => {
		const result = await testService.delete()
		expect(result).to.deep.equal({ foo: 'delete' })
	})

	it('`@HEAD` Decorator', async () => {
		const result = await testService.head()
		expect(result).to.deep.equal({ foo: 'head' })
	})

	it('`@OPTIONS` Decorator', async () => {
		const result = await testService.options()
		expect(result).to.deep.equal({ foo: 'options' })
	})

	it('`@TRACE` Decorator', async () => {
		const result = await testService.trace()
		expect(result).to.deep.equal({ foo: 'trace' })
	})

	it('`@CONNECT` Decorator', async () => {
		const result = await testService.connect()
		expect(result).to.deep.equal({ foo: 'connect' })
	})

	it('`@CUSTOM` Decorator', async () => {
		const result = await testService.custom()
		expect(result).to.deep.equal({ foo: 'custom' })
	})
})

describe('`@Headers` Decorator Group', () => {
	it('`@Headers.Service` Decorator', async () => {
		const result = await testService.serviceHeader()
		expect(result).to.deep.equal({ foo: 'serviceheaders' })
	})

	it('`@Headers.Method` Decorator', async () => {
		const result = await testService.methodHeader()
		expect(result).to.deep.equal({ foo: 'methodheaders' })
	})
})

describe('ServiceBuilder', () => {
	it('Secure Option', async () => {
		const result = await secureTestService.get()
		expect(result).to.deep.equal({ foo: 'get1-secure' })
	})

	it('Global Headers', async () => {
		// Using withoutHeadersService to test global headers because service headers override global headers
		// This is also testing if the hierarchy of headers is correct
		const result = await withoutHeadersService.globalHeader()
		expect(result).to.deep.equal({ foo: 'globalheaders' })
	})
})

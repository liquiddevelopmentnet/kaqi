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
		expect(result).to.deep.equal({ r: 'foo' })
	})
})

describe('HTTP Method Decorators', () => {
	it('`@GET` Decorator', async () => {
		const result = await testService.get()
		expect(result).to.deep.equal({ r: 'get1' })
	})

	it('`@POST` Decorator', async () => {
		const result = await testService.post()
		expect(result).to.deep.equal({ r: 'post' })
	})

	it('`@PUT` Decorator', async () => {
		const result = await testService.put()
		expect(result).to.deep.equal({ r: 'put' })
	})

	it('`@PATCH` Decorator', async () => {
		const result = await testService.patch()
		expect(result).to.deep.equal({ r: 'patch' })
	})

	it('`@DELETE` Decorator', async () => {
		const result = await testService.delete()
		expect(result).to.deep.equal({ r: 'delete' })
	})

	it('`@HEAD` Decorator', async () => {
		const result = await testService.head()
		expect(result).to.deep.equal({ r: 'head' })
	})

	it('`@OPTIONS` Decorator', async () => {
		const result = await testService.options()
		expect(result).to.deep.equal({ r: 'options' })
	})

	it('`@TRACE` Decorator', async () => {
		const result = await testService.trace()
		expect(result).to.deep.equal({ r: 'trace' })
	})

	it('`@CONNECT` Decorator', async () => {
		const result = await testService.connect()
		expect(result).to.deep.equal({ r: 'connect' })
	})

	it('`@CUSTOM` Decorator', async () => {
		const result = await testService.custom()
		expect(result).to.deep.equal({ r: 'custom' })
	})
})

describe('`@Headers` Decorator Group', () => {
	it('`@Headers.Service` Decorator', async () => {
		const result = await testService.serviceHeader()
		expect(result).to.deep.equal({ r: 'serviceheaders' })
	})

	it('`@Headers.Method` Decorator', async () => {
		const result = await testService.methodHeader()
		expect(result).to.deep.equal({ r: 'methodheaders' })
	})
})

describe('`@AxiosConfig` Decorator Group', () => {
	it('`@AxiosConfig.Service` Decorator', async () => {
		const result = await testService.axiosConfigService()
		expect(result).to.deep.equal({ r: 'serviceconfig' })
	})

	it('`@AxiosConfig.Method` Decorator', async () => {
		const result = await testService.axiosConfigMethod()
		expect(result).to.deep.equal({ r: 'methodconfig' })
	})
})

describe('ServiceBuilder', () => {
	it('Secure Option', async () => {
		const result = await secureTestService.get()
		expect(result).to.deep.equal({ r: 'get1-secure' })
	})

	it('Global Headers', async () => {
		// Using withoutHeadersService to test global headers because service headers override global headers
		// This is also testing if the hierarchy of headers is correct
		const result = await withoutHeadersService.globalHeader()
		expect(result).to.deep.equal({ r: 'globalheaders' })
	})
})

import { expect } from 'chai'
import { mockApi } from './mockapi'
import {
	TestService,
	secureTestService,
	testService,
	timeoutService,
	withoutHeadersService,
	serviceLevelDecoratorsTestService,
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

	it('`@AttachResponse` Decorator', async () => {
		const result = await testService.david()
		expect(result._res.headers['test-header']).to.equal('david123')
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

describe('`@Timeout` Decorator Group', () => {
	it('`@Timeout.Service` Decorator', async () => {
		try {
			await timeoutService.timeout()
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			expect(e.message).to.equal('timeout of 50ms exceeded')
		}
	})

	it('`@Timeout.Method` Decorator', async () => {
		try {
			await testService.timeout()
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			expect(e.message).to.equal('timeout of 100ms exceeded')
		}
	})
})

describe('`@Auth` Decorator Group', () => {
	it('`@Auth.BearerMethod` Decorator', async () => {
		const result = await testService.bearerAuth()
		expect(result).to.deep.equal({ r: 'bearer-success' })
	})

	it('`@Auth.BasicMethod` Decorator', async () => {
		const result = await testService.basicAuth()
		expect(result).to.deep.equal({ r: 'basic-success' })
	})

	it('`@Auth.ApiKeyMethod` Decorator', async () => {
		const result = await testService.apikeyAuth()
		expect(result).to.deep.equal({ r: 'apikey-success' })
	})

	it('`@Auth.BearerService` Decorator', async () => {
		const result = await serviceLevelDecoratorsTestService.serviceBearerAuth()
		expect(result).to.deep.equal({ r: 'service-bearer-success' })
	})
})

describe('`@ContentType` Decorator Group', () => {
	it('`@ContentType.JSON` Decorator', async () => {
		const result = await testService.jsonContent()
		expect(result).to.deep.equal({ r: 'json-content-success' })
	})

	it('`@ContentType.XML` Decorator', async () => {
		const result = await testService.xmlContent()
		expect(result).to.deep.equal({ r: 'xml-content-success' })
	})

	it('`@ContentType.FormData` Decorator', async () => {
		const result = await testService.formContent()
		expect(result).to.deep.equal({ r: 'form-content-success' })
	})

	it('`@ContentType.Service` Decorator', async () => {
		const result = await serviceLevelDecoratorsTestService.serviceContentType()
		expect(result).to.deep.equal({ r: 'service-json-success' })
	})
})

describe('`@BaseUrl` Decorator', () => {
	it('`@BaseUrl` Decorator', async () => {
		const result = await testService.customBaseUrl()
		expect(result).to.deep.equal({ r: 'custom-base-success' })
	})
})

describe('`@QueryParams` Decorator Group', () => {
	it('`@QueryParams.Method` Decorator', async () => {
		const result = await testService.queryParams()
		expect(result).to.deep.equal({ r: 'query-params-success' })
	})

	it('`@QueryParams.Service` Decorator', async () => {
		const result = await serviceLevelDecoratorsTestService.serviceQueryParams()
		expect(result).to.deep.equal({ r: 'service-query-success' })
	})
})

describe('`@ExpectStatus` Decorator', () => {
	it('`@ExpectStatus` with 201 status', async () => {
		const result = await testService.expectStatus201()
		expect(result).to.deep.equal({ r: 'status-201-success' })
	})

	it('`@ExpectStatus` with 400 status (array)', async () => {
		const result = await testService.expectStatus400()
		expect(result).to.deep.equal({ error: 'bad request' })
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

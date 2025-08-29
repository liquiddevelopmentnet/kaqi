/* eslint-disable @typescript-eslint/no-empty-function */
import kaqi, {
	Service,
	GET,
	POST,
	UrlSuffix,
	Hook,
	PUT,
	PATCH,
	DELETE,
	HEAD,
	OPTIONS,
	TRACE,
	CONNECT,
	CUSTOM,
	ServiceBuilder,
	Transient,
	Headers,
	AxiosConfig,
	Timeout,
	AttachResponse,
	Auth,
	ContentType,
	BaseUrl,
	QueryParams,
	ExpectStatus,
} from '../src'
import { WithAttachedRes } from '../src/utils'

@UrlSuffix('/api')
@Headers.Service({ 'Custom-Header': 'Service' })
@AxiosConfig.Service({
	headers: {
		'Axios-Config-Header': 'Service',
	},
})
export class TestService extends Service {
	@GET('/get')
	async get() {}

	@GET('/david')
	@AttachResponse()
	async david(): Promise<WithAttachedRes<{ r: string }>> {
		return kaqi.placeholder()
	}

	@GET('/john')
	async john() {}

	@Hook('john')
	private hook() {
		return {
			r: 'foo',
		}
	}

	@POST('/post')
	async post() {}

	@PUT('/put')
	async put() {}

	@PATCH('/patch')
	async patch() {}

	@DELETE('/delete')
	async delete() {}

	@HEAD('/head')
	async head() {}

	@OPTIONS('/options')
	async options() {}

	@TRACE('/trace')
	async trace() {}

	@CONNECT('/connect')
	async connect() {}

	@CUSTOM('CUSTOM', '/custom')
	async custom() {}

	@Transient
	async transient() {
		return 'transient function'
	}

	@GET('/serviceheader')
	async serviceHeader() {}

	@GET('/methodheader')
	@Headers.Method({ 'Custom-Header': 'Overridden' })
	async methodHeader() {}

	@GET('/serviceconfig')
	async axiosConfigService() {}

	@GET('/methodconfig')
	@AxiosConfig.Method({ method: 'POST' })
	async axiosConfigMethod() {}

	@GET('/timeout')
	@Timeout.Method(100)
	async timeout() {}

	// Auth test methods
	@GET('/bearer-auth')
	@Auth.BearerMethod('test-token-123')
	async bearerAuth() {}

	@GET('/basic-auth')
	@Auth.BasicMethod('testuser', 'testpass')
	async basicAuth() {}

	@GET('/apikey-auth')
	@Auth.ApiKeyMethod('X-API-Key', 'secret-api-key')
	async apikeyAuth() {}

	// Content-Type test methods
	@POST('/json-content')
	@ContentType.JSON()
	async jsonContent() {}

	@POST('/xml-content')
	@ContentType.XML()
	async xmlContent() {}

	@POST('/form-content')
	@ContentType.FormData()
	async formContent() {}

	@POST('/multipart-content')
	@ContentType.MultipartFormData()
	async multipartContent() {}

	@POST('/custom-content')
	@ContentType.Method('application/custom')
	async customContent() {}

	// Base URL test method
	@GET('/custom-base')
	@BaseUrl('http://different-host.com/different-api')
	async customBaseUrl() {}

	// Query params test method
	@GET('/query-test')
	@QueryParams.Method({ static: 'value', another: 'param' })
	async queryParams() {}

	// Expected status test methods
	@GET('/status-201')
	@ExpectStatus(201)
	async expectStatus201() {}

	@GET('/status-400')
	@ExpectStatus([400, 401])
	async expectStatus400() {}
}

@UrlSuffix('/api')
class WithoutHeadersService extends Service {
	@GET('/globalheader')
	async globalHeader() {}
}

@UrlSuffix('/api')
@Timeout.Service(50)
class TimeoutService extends Service {
	@GET('/timeout')
	async timeout() {}
}

@UrlSuffix('/api')
@Auth.BearerService('service-token-456')
@ContentType.Service('application/json')
@QueryParams.Service({ globalParam: 'globalValue' })
class ServiceLevelDecoratorsTestService extends Service {
	@GET('/bearer-auth')
	async serviceBearerAuth() {}

	@GET('/json-content')
	async serviceContentType() {}

	@GET('/query-test')
	async serviceQueryParams() {}
}

@UrlSuffix('/secure-api')
export class SecureTestService extends Service {
	@GET('/get-sec')
	async get() {}
}

const builder = new ServiceBuilder({
	host: 'api.com',
	secure: false,
	headers: {
		'Custom-Header': 'Global',
	},
})

const testService = builder.build(TestService)
const withoutHeadersService = builder.build(WithoutHeadersService)
const timeoutService = builder.build(TimeoutService)
const serviceLevelDecoratorsTestService = builder.build(ServiceLevelDecoratorsTestService)

builder.options.host = 'secure-api.com'
builder.options.secure = true
const secureTestService = builder.build(SecureTestService)

export { testService, secureTestService, withoutHeadersService, timeoutService, serviceLevelDecoratorsTestService }

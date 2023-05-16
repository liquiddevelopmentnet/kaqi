/* eslint-disable @typescript-eslint/no-empty-function */
import {
	Service,
	GET,
	UrlSuffix,
	Hook,
	POST,
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
} from '..'

@UrlSuffix('/api')
@Headers.Service({ 'Custom-Header': 'Service' })
export class TestService extends Service {
	@GET('/get')
	async get() {}

	@GET('/john')
	async john() {}

	@Hook('john')
	private hook() {
		return {
			foo: 'bar',
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
}

@UrlSuffix('/api')
class WithoutHeadersService extends Service {
	@GET('/globalheader')
	async globalHeader() {}
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

builder.options.host = 'secure-api.com'
builder.options.secure = true
const secureTestService = builder.build(SecureTestService)

export { testService, secureTestService, withoutHeadersService }

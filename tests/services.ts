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

	@GET('/headers')
	@Headers({ 'Custom-Header': 'Custom-Value' })
	async headers() {}
}

@UrlSuffix('/secure-api')
export class SecureTestService extends Service {
	@GET('/get-sec')
	async get() {}
}

const builder = new ServiceBuilder({
	host: 'api.com',
	secure: false,
})

const testService = builder.build(TestService)

builder.options.host = 'secure-api.com'
builder.options.secure = true
const secureTestService = builder.build(SecureTestService)

export { testService, secureTestService }

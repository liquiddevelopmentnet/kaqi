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
}

const testService = new ServiceBuilder()
	.setEndpoint('api.com')
	.setSecure(false)
	.build(TestService)

export { testService }

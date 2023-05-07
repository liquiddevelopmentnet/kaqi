import { Service } from '..'

export class ServiceBuilder {
	private _endpoint = ''
	private _secure = true
	private _basePath = ''
	private _headers: Record<string, string> = {}

	public setEndpoint(endpoint: string) {
		this._endpoint = endpoint
		return this
	}

	public setSecure(secure: boolean) {
		this._secure = secure
		return this
	}

	public setBasePath(basePath: string) {
		this._basePath = basePath
		return this
	}

	public setHeaders(headers: Record<string, string>) {
		this._headers = headers
		return this
	}

	public setHeader(key: string, value: string) {
		this._headers[key] = value
		return this
	}

	public build<T extends Service>(
		service: new (builder: ServiceBuilder) => T
	): T {
		return new service(this)
	}

	public get endpoint() {
		return this._endpoint
	}

	public get secure() {
		return this._secure
	}

	public get basePath() {
		return this._basePath
	}

	public get headers() {
		return this._headers
	}

	public get url() {
		return `${this.secure ? 'https' : 'http'}://${this.endpoint}${
			this.basePath
		}`
	}
}

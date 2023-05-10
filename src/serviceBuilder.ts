import { Service } from '..'

interface ServiceBuilderOptions {
	host: string
	secure?: boolean
	basePath?: string
	headers?: Record<string, string>
}

export class ServiceBuilder {
	public data: ServiceBuilderOptions

	public constructor(options: ServiceBuilderOptions) {
		this.data = options
	}

	public build<T extends Service>(
		service: new (builder: ServiceBuilder) => T
	): T {
		return new service(this)
	}

	public get url() {
		return `${this.data.secure ?? true ? 'https' : 'http'}://${this.data.host}${
			this.data.basePath ?? ''
		}`
	}
}

import { Service } from '..'

interface ServiceBuilderOptions {
	host: string
	secure?: boolean
	basePath?: string
	headers?: Record<string, string>
}

export class ServiceBuilder {
	public options: ServiceBuilderOptions

	public constructor(options: ServiceBuilderOptions) {
		this.options = options
	}

	public build<T extends Service>(
		service: new (builder: ServiceBuilder) => T
	): T {
		return new service(this)
	}

	public get url() {
		return `${this.options.secure ?? true ? 'https' : 'http'}://${
			this.options.host
		}${this.options.basePath ?? ''}`
	}
}

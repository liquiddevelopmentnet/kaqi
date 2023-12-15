import { AxiosRequestConfig } from 'axios'
import { Service } from '..'

/**
 * Options for configuring the ServiceBuilder.
 * @property host The host of the service.
 * @property secure Whether or not to use HTTPS.
 * @property basePath The base path of the service.
 * @property headers Headers to be sent with every request.
 * @property axiosConfig Axios configuration to be applied to every request.
 * @property timeout Timeout for every request.
 */
interface ServiceBuilderOptions {
	host: string
	secure?: boolean
	basePath?: string
	headers?: Record<string, string>
	axiosConfig?: AxiosRequestConfig
	timeout?: number
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

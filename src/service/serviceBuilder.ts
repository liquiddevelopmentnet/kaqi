import { AxiosRequestConfig } from 'axios'
import { Service } from '..'
import { removeTrailingSlashes } from '../utils'

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

	private resolvePotentialSchemaInHost() {
		if (this.options.host.startsWith('http://')) {
			this.options.secure = false
			this.options.host = this.options.host.replace(/^http:\/\//, '')
		}
		if (this.options.host.startsWith('https://')) {
			this.options.secure = true
			this.options.host = this.options.host.replace(/^https:\/\//, '')
		}
	}

	public build<T extends Service>(
		service: new (builder: ServiceBuilder) => T
	): T {
		this.resolvePotentialSchemaInHost()
		return new service(this)
	}

	public get url() {
		return `http${this.options.secure ? 's' : ''}://${removeTrailingSlashes(
			this.options.host
		)}${removeTrailingSlashes(this.options.basePath) ?? ''}`
	}
}

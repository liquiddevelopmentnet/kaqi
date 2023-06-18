import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { ServiceBuilder, Transient } from '..'
import { version } from '../package.json'

export class Service {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public _pre_p_props: any
	private _p_props: {
		endpoints: Record<
			string,
			{
				url: string
				method: string
				headers?: Record<string, string>
				axiosConfig?: AxiosRequestConfig
				timeout?: number
			}
		>
		hooks: Record<string, string[]>
		suffix?: string
		headers?: Record<string, string>
		axiosConfig?: AxiosRequestConfig
		timeout?: number
	}
	private _g_props: ServiceBuilder | undefined
	private _methodMap: Map<string, (this: Service, ...args: never[]) => void>
	private _axios: AxiosInstance

	constructor(builder: ServiceBuilder) {
		this._g_props = builder
		this._p_props = this._pre_p_props ?? { endpoints: {} }
		this._methodMap = this._makeMethodMap()

		this._axios = axios.create({
			baseURL: this._g_props.url + this._p_props.suffix ?? '',
		})

		this._methodMap.forEach((_method, name) => {
			this._buildEndpointFunction(name)
			this._injectHooks(name)
		})
	}

	@Transient
	private _makeMethodMap() {
		const methodMap = new Map<
			string,
			(this: Service, ...args: never[]) => void
		>()

		Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((name) => {
			const method = this[name as keyof Service]
			if (
				Object.getOwnPropertyDescriptor(method, '_transient')?.value === true ||
				name === 'constructor' ||
				typeof method !== 'function'
			)
				return
			if (this._p_props.endpoints[name]) methodMap.set(name, method.bind(this))
			else if (
				!(
					Object.getOwnPropertyNames(this._p_props.hooks ?? {}).find(
						(hookName) => this._p_props.hooks?.[hookName].includes(name)
					) ?? 0 > 0
				)
			)
				throw new Error(
					`Method "${name}" in service "${this.constructor.name}" is not decorated, use the @Transient decorator to ignore this method.`
				)
		})

		return methodMap
	}

	@Transient
	private _buildEndpointFunction(name: string) {
		const endpoint = this._p_props.endpoints[name]
		const url = `${this._g_props?.url}${this._p_props.suffix ?? ''}${
			endpoint.url
		}`

		this[name as keyof Service] = async () => {
			const axiosConfigInherit = {
				...this._g_props?.options.axiosConfig,
				...this._p_props.axiosConfig,
				...endpoint.axiosConfig,
			}

			const result = await this._axios.request({
				method: endpoint.method,
				url,

				timeout:
					endpoint.timeout ??
					this._p_props.timeout ??
					this._g_props?.options.timeout,

				...axiosConfigInherit,

				headers: {
					'User-Agent': `kaqi/${version}`,

					...this._g_props?.options.headers, // Endpoint headers override service headers override global headers ...
					...this._p_props.headers,
					...endpoint.headers,

					...axiosConfigInherit.headers,
				},
			})

			return result.data
		}
	}

	@Transient
	private _injectHooks(name: string) {
		if (this._p_props.hooks?.[name]) {
			this._p_props.hooks[name].forEach((hookName: string) => {
				const hook = this[hookName as keyof Service]
				if (hook instanceof Function) {
					const currentMethod = this[name as keyof Service]

					this[name as keyof Service] = async (...args: never[]) => {
						const result = await currentMethod(...args)
						return hook(result)
					}
				}
			})
		}
	}
}

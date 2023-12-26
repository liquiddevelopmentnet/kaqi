import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import { ParamType, ServiceBuilder, Transient } from '..'
import { version } from '../../package.json'

export interface PrivateProps {
	endpoints: {
		[key: string]: EndpointProps
	}
	errorHandlers?: Record<
		string,
		{
			httpStatus?: number | number[]
			endpoints?: string | string[]
		}
	>
	hooks: Record<string, string[]>
	suffix?: string
	headers?: Record<string, string>
	axiosConfig?: AxiosRequestConfig
	timeout?: number
}

export interface EndpointProps {
	url: string
	method: string
	headers?: Record<string, string>
	params?: {
		type: ParamType
		id: string
		index: number
	}[]
	axiosConfig?: AxiosRequestConfig
	timeout?: number
	cacheFor?: number
}

/**
 * Contains internal structure and methods to prepare for a service to be built based on the kaqi decorators.
 */
export class Service {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public _pre_p_props: any
	private _p_props: PrivateProps
	private _g_props: ServiceBuilder | undefined
	private _methodMap: Map<string, (this: Service, ...args: never[]) => void>
	private _axios: AxiosInstance
	private _cache: Map<string, { d: unknown; t: number }> = new Map()

	/**
	 * Constructs a new instance of the Service class.
	 * @param builder The ServiceBuilder used to configure the service.
	 */
	constructor(builder: ServiceBuilder) {
		this._g_props = builder
		this._p_props = this._pre_p_props ?? { endpoints: {} }
		this._methodMap = this._makeMethodMap()

		this._axios = axios.create({
			baseURL: this._g_props.url + this._p_props.suffix ?? '',
		})

		this._methodMap.forEach((_method, name) => {
			this._buildEndpointFunction(name)
			this._wrapCache(name)
			this._injectHooks(name)
		})
	}

	/**
	 * Wraps a method with caching functionality based on the specified cache duration, hooks are still executed AFTER cache evaluation.
	 * @param name - The name of the method to wrap with caching.
	 */
	@Transient
	private _wrapCache(name: string) {
		if (this._p_props.endpoints[name].cacheFor === undefined) return
		// eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
		const cacheFor = this._p_props.endpoints[name].cacheFor!
		const currentMethod = this[name as keyof Service]

		this[name as keyof Service] = async (...args: never[]) => {
			const key = JSON.stringify({ k: name, a: args })

			const cached = this._cache.get(key)
			if (cached && Date.now() - cached.t < cacheFor) {
				return cached.d
			} else {
				const result = await currentMethod.apply(this, args)
				this._cache.set(key, { d: result, t: Date.now() })
				return result
			}
		}
	}

	/**
	 * Creates a method map for the Service class.
	 * The method map contains all the methods of the Service class that are not decorated with @Transient.
	 * Each method in the map is bound to the current instance of the Service class.
	 * @returns A Map object where the keys are the method names and the values are the bound method functions.
	 */
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
				) &&
				!this._p_props.errorHandlers?.[name]
			)
				throw new Error(
					`Method "${name}" in service "${this.constructor.name}" is not decorated, use the @Transient decorator to ignore this method.`
				)
		})

		return methodMap
	}

	/**
	 * Builds an endpoint function based on the provided name, using the endpoint configuration.
	 * @param name - The name of the endpoint method.
	 */
	@Transient
	private _buildEndpointFunction(name: string) {
		const endpoint = this._p_props.endpoints[name]
		const pre_url = `${this._g_props?.url}${this._p_props.suffix ?? ''}${
			endpoint.url
		}`

		this[name as keyof Service] = async (...args: object[]) => {
			const url = endpoint.params
				? this._resolveUrl(
						pre_url,
						Object.values(endpoint.params).filter(
							(param) => param.type === ParamType.PATH
						),
						args
				  )
				: pre_url

			const axiosConfigInherit = {
				...this._g_props?.options.axiosConfig,
				...this._p_props.axiosConfig,
				...endpoint.axiosConfig,
			}

			const axiosConfig: AxiosRequestConfig = {
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

				params: endpoint.params
					?.filter((param) => param.type === ParamType.QUERY)
					?.reduce((acc, cur) => {
						acc[cur.id] = args[cur.index]
						return acc
					}, {} as Record<string, unknown>),
			}

			try {
				const result = await this._axios.request(axiosConfig)
				return result.data
			} catch (error) {
				if (error instanceof AxiosError) {
					if (!error.response) throw error
					this._handleHttpError(error, name)
					return Object.entries(error.response.data).length > 0
						? error.response.data
						: undefined
				}
			}
		}
	}

	/**
	 * Handles HTTP errors that occur during an axios request.
	 * @param error - The Axios error object.
	 * @param endpoint - The endpoint name where the error occurred.
	 */
	@Transient
	private _handleHttpError(error: AxiosError, endpoint: string) {
		type ErrorHandler = (error: AxiosError, method: string) => void
		let errorHandlerToUse: ErrorHandler | undefined

		Object.entries(this._p_props.errorHandlers ?? {}).forEach((value) => {
			if (!errorHandlerToUse) {
				errorHandlerToUse = this[value[0] as keyof this] as ErrorHandler
				return
			}

			// check if the error handler is more specific than the current one, if yes replace errorHandlerToUse
			// undefined, undefined < [404, 401], undefined < 404, undefined < 401, ['endpoint1', 'endpoint2'] < 401, 'endpoint1'

			Object.entries(this._p_props.errorHandlers ?? {}).forEach(
				([key, value]) => {
					if (!errorHandlerToUse) {
						errorHandlerToUse = this[key as keyof this] as ErrorHandler
						return
					}

					const currentHandler = this[key as keyof this] as ErrorHandler
					const currentHttpStatus = value.httpStatus
					const currentEndpoints = value.endpoints

					if (
						currentHandler &&
						((Array.isArray(currentHttpStatus) &&
							currentHttpStatus.includes(error.response?.status ?? 0)) ||
							currentHttpStatus === error.response?.status ||
							(Array.isArray(currentEndpoints) &&
								currentEndpoints.includes(endpoint)) ||
							currentEndpoints === endpoint)
					) {
						errorHandlerToUse = currentHandler
					}
				}
			)
		})

		if (errorHandlerToUse) errorHandlerToUse(error, endpoint)
		else throw error
	}

	/**
	 * Injects hooks into the methods of the service.
	 * @param name - The name of the method to inject the hooks into.
	 */
	@Transient
	private _injectHooks(name: string) {
		if (this._p_props.hooks?.[name]) {
			this._p_props.hooks[name].forEach((hookName: string) => {
				const hook = this[hookName as keyof Service]
				if (hook instanceof Function) {
					const currentMethod = this[name as keyof Service]

					this[name as keyof Service] = async (...args: never[]) => {
						const result = await currentMethod.apply(this, args)
						return hook(result)
					}
				}
			})
		}
	}

	/**
	 * Resolves the URL by replacing the placeholders with the provided arguments.
	 *
	 * @param url - The URL string with placeholders.
	 * @param params - An array of parameter names to be replaced in the URL.
	 * @param args - An array of argument values to replace the parameters in the URL.
	 * @returns The resolved URL string.
	 */
	@Transient
	private _resolveUrl(
		url: string,
		params: { type: ParamType; id: string; index: number }[],
		args: object[]
	): string {
		let newUrl = url
		const matches = newUrl.match(/({[^{}]*})/g) ?? []
		matches.forEach((match) => {
			const param = params.find((param) => param.id === match.slice(1, -1))
			if (param) {
				newUrl = newUrl.replace(match, args[param.index].toString())
			} else {
				throw new Error(
					`Value for parameter "${match.slice(
						1,
						-1
					)}" in endpoint "${url}" in service "${
						this.constructor.name
					}" is not provided.`
				)
			}
		})
		return newUrl
	}
}

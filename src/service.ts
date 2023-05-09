import axios, { Axios } from 'axios'
import { ServiceBuilder } from '..'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Transient = (target: any, methodName: string) =>
	Object.defineProperty(target[methodName], '_transient', {
		value: true,
		writable: false,
	})

export class Service {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public _pre_p_props: any
	private _p_props: {
		endpoints: Record<string, { url: string; method: string }>
		hooks: Record<string, string[]>
		suffix?: string
	}
	private _g_props: ServiceBuilder | undefined
	private _methodMap: Map<string, (this: Service, ...args: never[]) => void>
	private _axios: Axios

	constructor(builder: ServiceBuilder) {
		this._g_props = builder
		this._p_props = this._pre_p_props ?? { endpoints: {} }
		this._methodMap = this._makeMethodMap()

		this._axios = axios.create({
			baseURL: this._g_props.url + this._p_props.suffix ?? '',
			headers: this._g_props.headers,
		})

		this._methodMap.forEach((_method, name) => {
			this._buildEndpointFunction(name)
			this._injectHooks(name)
		})
	}

	@Transient
	private _makeMethodMap() {
		const methodMap = new Map<string, (this: Service, ...args: never[]) => void>()

		Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((name) => {
			const method = this[name as keyof Service]
			if (
				Object.getOwnPropertyDescriptor(method, '_transient')?.value === true ||
				name === 'constructor'
			) {
				return
			}
			if (method instanceof Function) {
				methodMap.set(name, method.bind(this))
			}
		})

		return methodMap
	}

	@Transient
	private _buildEndpointFunction(name: string) {
		const endpoint = this._p_props.endpoints[name]
		if (!endpoint) {
			throw new Error(`Method "${name}" in service "${this.constructor.name}" is not defined, use the @Transient decorator to ignore this method.`)
		}
		this[name as keyof Service] = async () => {
			const url = `${this._g_props?.url}${this._p_props.suffix ?? ''}${endpoint.url}`

			const result = await this._axios.request({
				method: endpoint.method,
				url,
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

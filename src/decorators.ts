import { AxiosRequestConfig } from 'axios'
import { Service } from '..'

const ensureProps = (target: Service, field: string) => {
	target._pre_p_props ??= {}
	target._pre_p_props[field] ||= {}
}

const ensureEndpoints = (target: Service, endpointName: string) => {
	ensureProps(target, 'endpoints')
	target._pre_p_props.endpoints[endpointName] ??= {}
}

const buildServiceDecorator =
	(fields: Record<string, unknown>) => (target: typeof Service) => {
		for (const field in fields) {
			ensureProps(target.prototype, field)
			if (typeof fields[field] === 'object')
				Object.assign(target.prototype._pre_p_props[field], fields[field])
			else target.prototype._pre_p_props[field] = fields[field]
		}
	}

const buildMethodDecorator =
	(fields: Record<string, unknown>) =>
	(target: Service, endpointName: string) => {
		ensureEndpoints(target, endpointName)
		for (const field in fields) {
			target._pre_p_props.endpoints[endpointName][field] ??= {}
			if (typeof fields[field] === 'object')
				Object.assign(
					target._pre_p_props.endpoints[endpointName][field],
					fields[field]
				)
			else target._pre_p_props.endpoints[endpointName][field] = fields[field]
		}
	}

const buildEndpointDecorator = (method: string) => (url: string) =>
	buildMethodDecorator({ url, method })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Transient = (target: any, methodName: string) =>
	Object.defineProperty(target[methodName], '_transient', {
		value: true,
		writable: false,
	})

export const UrlSuffix = (suffix = '') => buildServiceDecorator({ suffix })

export const Hook =
	(endpointName: string) => (target: Service, hookName: string) => {
		ensureProps(target, 'hooks')
		target._pre_p_props.hooks[endpointName] ??= []
		target._pre_p_props.hooks[endpointName].push(hookName)
	}

export const GET = buildEndpointDecorator('GET')
export const POST = buildEndpointDecorator('POST')
export const PUT = buildEndpointDecorator('PUT')
export const PATCH = buildEndpointDecorator('PATCH')
export const DELETE = buildEndpointDecorator('DELETE')
export const HEAD = buildEndpointDecorator('HEAD')
export const OPTIONS = buildEndpointDecorator('OPTIONS')
export const TRACE = buildEndpointDecorator('TRACE')
export const CONNECT = buildEndpointDecorator('CONNECT')

export const CUSTOM = (method: string, url: string) =>
	buildMethodDecorator({ url, method })

export const Headers = {
	Service: (headers: Record<string, string>) =>
		buildServiceDecorator({ headers }),
	Method: (headers: Record<string, string>) =>
		buildMethodDecorator({ headers }),
}

export const AxiosConfig = {
	Service: (axiosConfig: AxiosRequestConfig) =>
		buildServiceDecorator({ axiosConfig }),

	Method: (axiosConfig: AxiosRequestConfig) =>
		buildMethodDecorator({ axiosConfig }),

	// TODO: Request parameter config
}

export const Timeout = {
	Service: (timeout: number) => buildServiceDecorator({ timeout }),

	Method: (timeout: number) => buildMethodDecorator({ timeout }),
}

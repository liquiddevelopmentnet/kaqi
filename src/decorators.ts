import { Service } from '..'

const ensureProps = (target: Service, field: string) => {
	target._pre_p_props ??= {}
	target._pre_p_props[field] ||= {}
}

const ensureEndpoints = (target: Service, endpointName: string) => {
	ensureProps(target, 'endpoints')
	target._pre_p_props.endpoints[endpointName] ??= {}
}

const buildEndpoint =
	(method: string) =>
	(url: string) =>
	(target: Service, endpointName: string) => {
		ensureEndpoints(target, endpointName)
		target._pre_p_props.endpoints[endpointName].url = url
		target._pre_p_props.endpoints[endpointName].method = method
	}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Transient = (target: any, methodName: string) =>
	Object.defineProperty(target[methodName], '_transient', {
		value: true,
		writable: false,
	})

export const UrlSuffix =
	(suffix = '') =>
	(target: typeof Service) => {
		ensureProps(target.prototype, 'suffix')
		target.prototype._pre_p_props.suffix = suffix
	}

export const Hook =
	(endpointName: string) => (target: Service, hookName: string) => {
		ensureProps(target, 'hooks')
		target._pre_p_props.hooks[endpointName] ??= []
		target._pre_p_props.hooks[endpointName].push(hookName)
	}

export const GET = buildEndpoint('GET')
export const POST = buildEndpoint('POST')
export const PUT = buildEndpoint('PUT')
export const PATCH = buildEndpoint('PATCH')
export const DELETE = buildEndpoint('DELETE')
export const HEAD = buildEndpoint('HEAD')
export const OPTIONS = buildEndpoint('OPTIONS')
export const TRACE = buildEndpoint('TRACE')
export const CONNECT = buildEndpoint('CONNECT')

export const CUSTOM =
	(method: string, url: string) => (target: Service, endpointName: string) => {
		ensureEndpoints(target, endpointName)
		target._pre_p_props.endpoints[endpointName].url = url
		target._pre_p_props.endpoints[endpointName].method = method
	}

/*export const Headers =
	(headers: Record<string, string>) =>
	(target: Service, endpointName: string) => {
		ensureEndpoints(target, endpointName)
		target._pre_p_props.endpoints[endpointName].headers ??= {}
		Object.assign(target._pre_p_props.endpoints[endpointName].headers, headers)
	}

export const Headers =
	(headers: Record<string, string>) => (target: typeof Service) => {
		ensureProps(target.prototype, 'headers')
		Object.assign(target.prototype._pre_p_props.headers, headers)
	}*/

export const Headers = {
	Method:
		(headers: Record<string, string>) =>
		(target: Service, endpointName: string) => {
			ensureEndpoints(target, endpointName)
			target._pre_p_props.endpoints[endpointName].headers ??= {}
			Object.assign(
				target._pre_p_props.endpoints[endpointName].headers,
				headers
			)
		},

	Service: (headers: Record<string, string>) => (target: typeof Service) => {
		ensureProps(target.prototype, 'headers')
		Object.assign(target.prototype._pre_p_props.headers, headers)
	},
}

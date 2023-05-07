import { Service } from '..'

const ensureProps = (target: Service, field: string) => {
	target._pre_p_props ??= {}
	target._pre_p_props[field] ||= {}
}

const buildEndpoint = (method: string) => (url: string) => (target: Service, endpointName: string) => {
	ensureProps(target, 'endpoints')
	target._pre_p_props.endpoints[endpointName] ??= { url, method: method }
}


export const UrlSuffix = (suffix = '') => (target: typeof Service) => {
	ensureProps(target.prototype, 'suffix')
	target.prototype._pre_p_props.suffix = suffix
}

export const Hook = (endpointName: string) => (target: Service, hookName: string) => {
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

export const CUSTOM = (method: string, url: string) => (target: Service, endpointName: string) => {
	ensureProps(target, 'endpoints')
	target._pre_p_props.endpoints[endpointName] ??= { url, method: method }
}

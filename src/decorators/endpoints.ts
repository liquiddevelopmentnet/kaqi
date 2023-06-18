import { buildMethodDecorator } from './sharedUtils'

const buildEndpointDecorator = (method: string) => (url: string) =>
	buildMethodDecorator({ url, method })

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

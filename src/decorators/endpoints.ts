import { buildMethodDecorator } from './sharedUtils'

/**
 * Builds an endpoint decorator for the specified HTTP method.
 * @param method The HTTP method for the endpoint.
 * @returns The endpoint decorator function.
 */
const buildEndpointDecorator = (method: string) => (url: string) =>
	buildMethodDecorator({ url, method })

/**
 * Decorator function for defining a GET endpoint.
 *
 * @param path - The path of the endpoint.
 * @returns The decorated function.
 */
export const GET = buildEndpointDecorator('GET')

/**
 * Decorator function for defining a POST endpoint.
 *
 * @param path - The path of the endpoint.
 * @returns The decorated function.
 */
export const POST = buildEndpointDecorator('POST')

/**
 * Decorator function for defining a PUT endpoint.
 *
 * @param path - The path of the endpoint.
 * @returns The decorated function.
 */
export const PUT = buildEndpointDecorator('PUT')

/**
 * Decorator function for defining a PATCH endpoint.
 *
 * @param path - The path of the endpoint.
 * @returns The decorated function.
 */
export const PATCH = buildEndpointDecorator('PATCH')

/**
 * Decorator function for defining a DELETE endpoint.
 *
 * @param path - The path of the endpoint.
 * @returns The decorated function.
 */
export const DELETE = buildEndpointDecorator('DELETE')

/**
 * Decorator function for defining a HEAD endpoint.
 *
 * @param path - The path of the endpoint.
 * @returns The decorated function.
 */
export const HEAD = buildEndpointDecorator('HEAD')

/**
 * Decorator function for defining a OPTIONS endpoint.
 *
 * @param path - The path of the endpoint.
 * @returns The decorated function.
 */
export const OPTIONS = buildEndpointDecorator('OPTIONS')

/**
 * Decorator function for defining a TRACE endpoint.
 *
 * @param path - The path of the endpoint.
 * @returns The decorated function.
 */
export const TRACE = buildEndpointDecorator('TRACE')

/**
 * Decorator function for defining a CONNECT endpoint.
 *
 * @param path - The path of the endpoint.
 * @returns The decorated function.
 */
export const CONNECT = buildEndpointDecorator('CONNECT')

/**
 * Decorator function for defining a custom endpoint.
 *
 * @param method - The HTTP method of the endpoint.
 * @param path - The path of the endpoint.
 * @returns The decorated function.
 */
export const CUSTOM = (method: string, url: string) =>
	buildMethodDecorator({ url, method })

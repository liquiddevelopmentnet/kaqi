import { AxiosRequestConfig } from 'axios'
import {
	buildMethodDecorator,
	buildServiceDecorator,
	ensureProps,
} from './sharedUtils'
import { Service } from '..'

/**
 * Decorator that marks a method as transient.
 * Transient methods are not processed by kaqi.
 * @param target - The target object.
 * @param methodName - The name of the method.
 * @returns A decorator function.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Transient = (target: any, methodName: string) =>
	Object.defineProperty(target[methodName], '_transient', {
		value: true,
		writable: false,
	})

/**
 * Decorator that appends a suffix to the URL of a service.
 *
 * @param suffix The suffix to append to the URL.
 * @returns The decorated service.
 */
export const UrlSuffix = (suffix = '') => buildServiceDecorator({ suffix })

/**
 * Decorator that adds an error handler to a service method.
 *
 * @param httpStatus - The HTTP status code(s) to be handled by the error handler.
 * @param endpoints - The endpoint(s) to be handled by the error handler.
 * @returns A decorator function.
 */
export const ErrorHandler =
	(httpStatus?: number | number[], endpoints?: string | string[]) =>
	(target: Service, method: string) => {
		ensureProps(target, 'errorHandlers')
		target._pre_p_props.errorHandlers[method.toString()] = {
			httpStatus,
			endpoints,
		}
	}

/**
 * Decorator that adds a hook to a service, which is executed after the specified endpoint, and therefore can modify the response.
 * @param endpointName The name of the endpoint.
 * @returns A decorator function.
 */
export const Hook =
	(endpointName: string) => (target: Service, hookName: string) => {
		ensureProps(target, 'hooks')
		target._pre_p_props.hooks[endpointName] ??= []
		target._pre_p_props.hooks[endpointName].push(hookName)
	}

/**
 * Decorators for setting headers in service and method calls.
 */
export const Headers = {
	/**
	 * Decorator for setting headers in service calls.
	 * @param headers - The headers to be set.
	 */
	Service: (headers: Record<string, string>) =>
		buildServiceDecorator({ headers }),
	/**
	 * Decorator for setting headers in method calls.
	 * @param headers - The headers to be set.
	 */
	Method: (headers: Record<string, string>) =>
		buildMethodDecorator({ headers }),
}

/**
 * AxiosConfig object containing decorators for configuring Axios requests.
 */
export const AxiosConfig = {
	/**
	 * Service decorator for configuring Axios requests at the service level.
	 * @param axiosConfig The Axios request configuration.
	 */
	Service: (axiosConfig: AxiosRequestConfig) =>
		buildServiceDecorator({ axiosConfig }),

	/**
	 * Method decorator for configuring Axios requests at the method level.
	 * @param axiosConfig The Axios request configuration.
	 */
	Method: (axiosConfig: AxiosRequestConfig) =>
		buildMethodDecorator({ axiosConfig }),

	// TODO: Request parameter config
}

/**
 * Timeout decorator namespace.
 */
export const Timeout = {
	/**
	 * Service level timeout decorator.
	 * @param timeout - The timeout value in milliseconds.
	 * @returns The decorated service.
	 */
	Service: (timeout: number) => buildServiceDecorator({ timeout }),

	/**
	 * Method level timeout decorator.
	 * @param timeout - The timeout value in milliseconds.
	 * @returns The decorated method.
	 */
	Method: (timeout: number) => buildMethodDecorator({ timeout }),
}

/**
 * CacheFor decorator.
 * This decorator can be used to cache the result of a method for a specified duration.
 * @param duration - The duration for which the result should be cached, in milliseconds.
 * @returns The decorated method with caching enabled for the specified duration.
 */
export const CacheFor = (duration: number) =>
	buildMethodDecorator({ cacheFor: duration })

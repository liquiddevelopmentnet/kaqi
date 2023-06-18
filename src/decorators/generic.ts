import { AxiosRequestConfig } from 'axios'
import {
	buildMethodDecorator,
	buildServiceDecorator,
	ensureProps,
} from './sharedUtils'
import { Service } from '../..'

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

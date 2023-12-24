import { Service } from '../service/service'
import { ensureEndpoints } from './sharedUtils'

export enum ParamType {
	PATH = 'path',
	QUERY = 'query',
}

/**
 * Decorator function that adds a path parameter to a service method.
 *
 * @param id - The identifier for the path parameter.
 * @returns A decorator function that can be applied to a parameter which is part of a service's endpoint method.
 */
export const Path =
	(id: string) =>
	(target: Service, propertyKey: string, parameterIndex: number) => {
		ensureEndpoints(target, propertyKey)
		target._pre_p_props.endpoints[propertyKey].params ??= []
		target._pre_p_props.endpoints[propertyKey].params.push({
			type: ParamType.PATH,
			id,
			index: parameterIndex,
		})
	}

/**
 * Decorator function for specifying a query parameter in a service method.
 *
 * @param id - The identifier of the query parameter.
 * @returns A decorator function that adds the query parameter to the service method.
 */
export const Query =
	(id: string) =>
	(target: Service, propertyKey: string, parameterIndex: number) => {
		ensureEndpoints(target, propertyKey)
		target._pre_p_props.endpoints[propertyKey].params ??= []
		target._pre_p_props.endpoints[propertyKey].params.push({
			type: ParamType.QUERY,
			id,
			index: parameterIndex,
		})
	}

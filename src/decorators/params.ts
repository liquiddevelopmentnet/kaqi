import { Service } from '../service/service'
import { ensureEndpoints } from './sharedUtils'

export enum ParamType {
	PATH = 'path',
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

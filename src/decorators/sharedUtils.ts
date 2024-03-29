import { EndpointProps, PrivateProps, Service } from '..'

/**
 * Ensures that the specified field exists in the target service's _pre_p_props property.
 * If the field does not exist, it will be created.
 *
 * @param target - The target object.
 * @param field - The name of the field to ensure.
 */
export const ensureProps = (target: Service, field: keyof PrivateProps) => {
	target._pre_p_props ??= {}
	target._pre_p_props[field] ||= {}
}

/**
 * Ensures that the specified endpoint exists in the target service's endpoints property.
 * If the endpoint does not exist, it will be created.
 *
 * @param target - The target object.
 * @param endpointName - The name of the endpoint to ensure.
 */
export const ensureEndpoints = (target: Service, endpointName: string) => {
	ensureProps(target, 'endpoints')
	target._pre_p_props.endpoints[endpointName] ??= {}
}

/**
 * Builds a decorator function for the Service class.
 *
 * @param fields - The fields to be added to the target service's _pre_p_props property.
 * @returns A decorator function.
 */
export const buildServiceDecorator =
	(fields: { [key in keyof PrivateProps]?: unknown }) =>
	(target: typeof Service) => {
		for (const _field in fields) {
			const field = _field as keyof PrivateProps
			ensureProps(target.prototype, field)
			if (typeof fields[field] === 'object')
				Object.assign(target.prototype._pre_p_props[field], fields[field])
			else target.prototype._pre_p_props[field] = fields[field]
		}
	}

/**
 * Builds a decorator function for a service method.
 *
 * @param fields - The fields to be added to the target service's endpoints property.
 * @returns A decorator function.
 */
export const buildMethodDecorator =
	(fields: { [key in keyof EndpointProps]?: unknown }) =>
	(target: Service, endpointName: string) => {
		ensureEndpoints(target, endpointName)
		for (const _field in fields) {
			const field = _field as keyof EndpointProps
			target._pre_p_props.endpoints[endpointName][field] ??= {}
			if (typeof fields[field] === 'object')
				Object.assign(
					target._pre_p_props.endpoints[endpointName][field],
					fields[field]
				)
			else target._pre_p_props.endpoints[endpointName][field] = fields[field]
		}
	}

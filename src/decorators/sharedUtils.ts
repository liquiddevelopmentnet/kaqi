import { Service } from '../..'

export const ensureProps = (target: Service, field: string) => {
	target._pre_p_props ??= {}
	target._pre_p_props[field] ||= {}
}

const ensureEndpoints = (target: Service, endpointName: string) => {
	ensureProps(target, 'endpoints')
	target._pre_p_props.endpoints[endpointName] ??= {}
}

export const buildServiceDecorator =
	(fields: Record<string, unknown>) => (target: typeof Service) => {
		for (const field in fields) {
			ensureProps(target.prototype, field)
			if (typeof fields[field] === 'object')
				Object.assign(target.prototype._pre_p_props[field], fields[field])
			else target.prototype._pre_p_props[field] = fields[field]
		}
	}

export const buildMethodDecorator =
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

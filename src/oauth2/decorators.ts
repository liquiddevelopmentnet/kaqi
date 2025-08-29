import { buildMethodDecorator, buildServiceDecorator } from '../decorators/sharedUtils'
import { OAuth2ServiceConfig, OAuth2MethodConfig } from './types'

/**
 * OAuth2 decorator namespace for service and method level authentication
 */
export const OAuth2 = {
	/**
	 * Service-level OAuth2 configuration decorator
	 * @param config OAuth2 service configuration
	 */
	Service: (config: OAuth2ServiceConfig) =>
		buildServiceDecorator({ oauth2Config: config }),

	/**
	 * Method-level OAuth2 configuration decorator
	 * @param config OAuth2 method configuration
	 */
	Method: (config: OAuth2MethodConfig) =>
		buildMethodDecorator({ oauth2Config: config }),
}
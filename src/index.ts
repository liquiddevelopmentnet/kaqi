/**
 * This file exports various modules and defines a default export.
 * @module kaqi
 */
export * from './decorators/generic'
export * from './decorators/endpoints'
export * from './decorators/params'
export * from './service/service'
export * from './service/serviceBuilder'
export * from './kaqiPlaceholder'

import { kaqiPlaceholder } from './kaqiPlaceholder'

export default { placeholder: kaqiPlaceholder }

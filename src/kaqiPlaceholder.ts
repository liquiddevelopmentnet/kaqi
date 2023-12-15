/**
 * Creates a placeholder object of type T.
 * This is used to make the TypeScript compiler happy when creating a kaqi endpoint method,
 * as they are not supposed to have a body which is user-defined.
 *
 * @example
 * \@GET('/abc')
 * async get() {
 *   return kaqi.placeholder()
 * }
 * @returns {T} A placeholder object of type T.
 */
export function kaqiPlaceholder<T>(): T {
	return <T>{}
}

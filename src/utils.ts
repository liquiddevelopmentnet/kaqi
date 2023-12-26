/**
 * Removes trailing slashes from a string.
 *
 * @param str - The input string.
 * @returns The string with trailing slashes removed.
 */
export const removeTrailingSlashes = (str?: string) =>
	str ? str.replace(/(?<![:/])[/]+$/g, '') : undefined

/**
 * Adds a leading slash to a string if it doesn't already have one.
 *
 * @param str - The string to add a leading slash to.
 * @returns The string with a leading slash.
 */
export const addLeadingSlash = (str?: string) =>
	str ? (str.startsWith('/') ? str : '/' + str) : undefined

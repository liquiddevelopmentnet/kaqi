/**
 * OAuth2 grant types supported by the framework
 */
export type OAuth2GrantType = 'client_credentials' | 'authorization_code' | 'refresh_token'

/**
 * OAuth2 token response interface
 */
export interface OAuth2TokenResponse {
	access_token: string
	token_type?: string
	expires_in?: number
	refresh_token?: string
	scope?: string
}

/**
 * OAuth2 client configuration
 */
export interface OAuth2ClientConfig {
	clientId: string
	clientSecret: string
	tokenUrl: string
	grantType?: OAuth2GrantType
	scope?: string
}

/**
 * OAuth2 configuration options for services
 */
export interface OAuth2ServiceConfig extends OAuth2ClientConfig {
	autoRefresh?: boolean
	refreshThreshold?: number
}

/**
 * OAuth2 method-level configuration
 */
export interface OAuth2MethodConfig {
	scope?: string
	skipAuth?: boolean
}

/**
 * Internal OAuth2 token storage
 */
export interface OAuth2TokenStore {
	accessToken?: string
	refreshToken?: string
	expiresAt?: number
	tokenType?: string
}
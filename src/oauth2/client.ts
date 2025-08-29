import axios, { AxiosInstance } from 'axios'
import {
	OAuth2ClientConfig,
	OAuth2TokenResponse,
	OAuth2TokenStore,
	OAuth2GrantType,
} from './types'

/**
 * OAuth2 client for handling authentication flows
 */
export class OAuth2Client {
	private config: OAuth2ClientConfig
	private tokenStore: OAuth2TokenStore = {}
	private httpClient: AxiosInstance

	constructor(config: OAuth2ClientConfig) {
		this.config = config
		this.httpClient = axios.create()
	}

	/**
	 * Get a valid access token, refreshing if necessary
	 */
	async getAccessToken(): Promise<string> {
		if (this.isTokenValid()) {
			return this.tokenStore.accessToken!
		}

		if (this.canRefreshToken()) {
			await this.refreshToken()
		} else {
			await this.authenticate()
		}

		return this.tokenStore.accessToken!
	}

	/**
	 * Authenticate using the configured grant type
	 */
	private async authenticate(): Promise<void> {
		const grantType = this.config.grantType || 'client_credentials'
		
		switch (grantType) {
			case 'client_credentials':
				await this.clientCredentialsFlow()
				break
			default:
				throw new Error(`Unsupported grant type: ${grantType}`)
		}
	}

	/**
	 * Perform client credentials OAuth2 flow
	 */
	private async clientCredentialsFlow(): Promise<void> {
		const params = new URLSearchParams()
		params.append('grant_type', 'client_credentials')
		params.append('client_id', this.config.clientId)
		params.append('client_secret', this.config.clientSecret)
		
		if (this.config.scope) {
			params.append('scope', this.config.scope)
		}

		const response = await this.httpClient.post<OAuth2TokenResponse>(
			this.config.tokenUrl,
			params,
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		)

		this.storeTokens(response.data)
	}

	/**
	 * Refresh the access token using refresh token
	 */
	private async refreshToken(): Promise<void> {
		if (!this.tokenStore.refreshToken) {
			throw new Error('No refresh token available')
		}

		const params = new URLSearchParams()
		params.append('grant_type', 'refresh_token')
		params.append('refresh_token', this.tokenStore.refreshToken)
		params.append('client_id', this.config.clientId)
		params.append('client_secret', this.config.clientSecret)

		const response = await this.httpClient.post<OAuth2TokenResponse>(
			this.config.tokenUrl,
			params,
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		)

		this.storeTokens(response.data)
	}

	/**
	 * Store tokens from OAuth2 response
	 */
	private storeTokens(tokenResponse: OAuth2TokenResponse): void {
		this.tokenStore.accessToken = tokenResponse.access_token
		this.tokenStore.tokenType = tokenResponse.token_type || 'Bearer'
		
		if (tokenResponse.refresh_token) {
			this.tokenStore.refreshToken = tokenResponse.refresh_token
		}
		
		if (tokenResponse.expires_in) {
			this.tokenStore.expiresAt = Date.now() + (tokenResponse.expires_in * 1000)
		}
	}

	/**
	 * Check if current token is valid
	 */
	private isTokenValid(): boolean {
		if (!this.tokenStore.accessToken) {
			return false
		}

		if (!this.tokenStore.expiresAt) {
			return true
		}

		const threshold = 60000 // 1 minute buffer
		return Date.now() < (this.tokenStore.expiresAt - threshold)
	}

	/**
	 * Check if token can be refreshed
	 */
	private canRefreshToken(): boolean {
		return Boolean(this.tokenStore.refreshToken)
	}

	/**
	 * Get authorization header value
	 */
	getAuthorizationHeader(): string {
		if (!this.tokenStore.accessToken) {
			throw new Error('No access token available')
		}
		
		const tokenType = this.tokenStore.tokenType || 'Bearer'
		return `${tokenType} ${this.tokenStore.accessToken}`
	}

	/**
	 * Clear stored tokens
	 */
	clearTokens(): void {
		this.tokenStore = {}
	}
}
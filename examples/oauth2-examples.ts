/**
 * OAuth2 Usage Examples
 * 
 * This file demonstrates how to use OAuth2 authentication with kaqi.
 * These examples show various OAuth2 configurations and patterns.
 */

import { Service, ServiceBuilder, GET, POST, PUT, DELETE, UrlSuffix, OAuth2 } from '../src'

// Example 1: Basic OAuth2 Service with Client Credentials
@UrlSuffix('/api/v1')
@OAuth2.Service({
	clientId: 'my-app-client-id',
	clientSecret: 'my-app-client-secret',
	tokenUrl: 'https://auth.myapi.com/oauth/token',
	grantType: 'client_credentials',
	scope: 'read write'
})
export class BasicApiService extends Service {
	@GET('/users')
	async getUsers() {
		// Automatically includes: Authorization: Bearer <access_token>
		return this
	}

	@POST('/users')
	async createUser(user: { name: string; email: string }) {
		// Also automatically authenticated
		return this
	}

	@GET('/health')
	@OAuth2.Method({ skipAuth: true })
	async getHealth() {
		// This endpoint is public, no OAuth2 authentication
		return this
	}
}

// Example 2: Service with Global OAuth2 Configuration via ServiceBuilder
const authenticatedBuilder = new ServiceBuilder({
	host: 'api.example.com',
	secure: true,
	oauth2Config: {
		clientId: 'global-client-id',
		clientSecret: 'global-client-secret',
		tokenUrl: 'https://oauth.example.com/token',
		grantType: 'client_credentials',
		scope: 'api:read api:write'
	}
})

@UrlSuffix('/v2')
export class GloballyAuthenticatedService extends Service {
	@GET('/profile')
	async getProfile() {
		// Uses global OAuth2 configuration
		return this
	}

	@PUT('/profile')
	async updateProfile(profile: { name: string }) {
		// Also uses global OAuth2 configuration
		return this
	}
}

// Example 3: Mixed Authentication with Method-level Overrides
@UrlSuffix('/admin')
@OAuth2.Service({
	clientId: 'admin-client',
	clientSecret: 'admin-secret',
	tokenUrl: 'https://auth.company.com/oauth/token',
	scope: 'basic'
})
export class AdminApiService extends Service {
	@GET('/dashboard')
	async getDashboard() {
		// Uses service-level scope: 'basic'
		return this
	}

	@GET('/users')
	@OAuth2.Method({ scope: 'admin:users' })
	async getUsers() {
		// Overrides scope to 'admin:users' for this method
		return this
	}

	@DELETE('/users/:id')
	@OAuth2.Method({ scope: 'admin:users:delete' })
	async deleteUser(id: string) {
		// Uses elevated scope for delete operations
		return this
	}

	@GET('/public-stats')
	@OAuth2.Method({ skipAuth: true })
	async getPublicStats() {
		// Public endpoint within admin service
		return this
	}
}

// Example 4: Multiple Services with Different OAuth2 Providers
@OAuth2.Service({
	clientId: 'github-app-id',
	clientSecret: 'github-app-secret',
	tokenUrl: 'https://github.com/login/oauth/access_token',
	scope: 'repo user'
})
export class GitHubApiService extends Service {
	@GET('/user')
	async getCurrentUser() {
		return this
	}

	@GET('/user/repos')
	async getUserRepos() {
		return this
	}
}

@OAuth2.Service({
	clientId: 'google-client-id',
	clientSecret: 'google-client-secret',
	tokenUrl: 'https://oauth2.googleapis.com/token',
	scope: 'https://www.googleapis.com/auth/userinfo.profile'
})
export class GoogleApiService extends Service {
	@GET('/userinfo')
	async getUserInfo() {
		return this
	}
}

// Usage Examples:

async function examples() {
	// Basic usage with service-level OAuth2
	const basicBuilder = new ServiceBuilder({
		host: 'my-api.com',
		secure: true
	})
	const basicApi = basicBuilder.build(BasicApiService)
	
	try {
		const users = await basicApi.getUsers()
		const health = await basicApi.getHealth() // No auth required
		console.log('Users:', users, 'Health:', health)
	} catch (error) {
		console.error('API call failed:', error)
	}

	// Global OAuth2 configuration
	const globalApi = authenticatedBuilder.build(GloballyAuthenticatedService)
	
	try {
		const profile = await globalApi.getProfile()
		console.log('Profile:', profile)
	} catch (error) {
		console.error('Authentication failed:', error)
	}

	// Admin service with method-level scope overrides
	const adminBuilder = new ServiceBuilder({
		host: 'admin.company.com',
		secure: true
	})
	const adminApi = adminBuilder.build(AdminApiService)
	
	try {
		const dashboard = await adminApi.getDashboard() // basic scope
		const users = await adminApi.getUsers() // admin:users scope
		const stats = await adminApi.getPublicStats() // no auth
		console.log('Dashboard:', dashboard, 'Users:', users, 'Stats:', stats)
	} catch (error) {
		console.error('Admin API call failed:', error)
	}

	// Multiple OAuth2 providers
	const githubBuilder = new ServiceBuilder({
		host: 'api.github.com',
		secure: true
	})
	const githubApi = githubBuilder.build(GitHubApiService)

	const googleBuilder = new ServiceBuilder({
		host: 'www.googleapis.com/oauth2/v1',
		secure: true
	})
	const googleApi = googleBuilder.build(GoogleApiService)

	try {
		const [githubUser, googleUser] = await Promise.all([
			githubApi.getCurrentUser(),
			googleApi.getUserInfo()
		])
		console.log('GitHub User:', githubUser, 'Google User:', googleUser)
	} catch (error) {
		console.error('Multi-provider authentication failed:', error)
	}
}

// Error Handling Best Practices
async function errorHandlingExample() {
	const builder = new ServiceBuilder({
		host: 'api.example.com',
		secure: true
	})
	const api = builder.build(BasicApiService)

	try {
		const result = await api.getUsers()
		console.log('Success:', result)
	} catch (error) {
		if (error instanceof Error) {
			if (error.message.includes('OAuth2 authentication failed')) {
				console.error('Authentication error:', error.message)
				// Handle authentication-specific errors
				// E.g., redirect to login, refresh configuration, etc.
			} else {
				console.error('General API error:', error.message)
				// Handle other API errors
			}
		}
	}
}
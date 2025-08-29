# OAuth2 Authentication

This module provides OAuth2 authentication support for external providers in kaqi.

## Features

- **Client Credentials Flow**: Supports OAuth2 client credentials grant type
- **Automatic Token Management**: Handles token acquisition, storage, and refresh
- **Service-level Configuration**: Configure OAuth2 at the service level using `@OAuth2.Service`
- **Method-level Overrides**: Override OAuth2 behavior per method with `@OAuth2.Method`
- **Skip Authentication**: Exclude specific endpoints from OAuth2 authentication
- **Type Safety**: Full TypeScript support with comprehensive interfaces

## Usage

### Service-level OAuth2 Configuration

```typescript
import { Service, GET, POST, OAuth2, UrlSuffix } from 'kaqi'

@UrlSuffix('/api/v1')
@OAuth2.Service({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  tokenUrl: 'https://auth.example.com/oauth/token',
  grantType: 'client_credentials',
  scope: 'read write'
})
export class ApiService extends Service {
  @GET('/users')
  async getUsers() {
    // Automatically includes Authorization header
  }

  @POST('/users')
  async createUser() {
    // Also automatically authenticated
  }

  @GET('/public/status')
  @OAuth2.Method({ skipAuth: true })
  async getStatus() {
    // This endpoint skips OAuth2 authentication
  }
}
```

### Global OAuth2 Configuration via ServiceBuilder

```typescript
import { ServiceBuilder } from 'kaqi'

const builder = new ServiceBuilder({
  host: 'api.example.com',
  secure: true,
  oauth2Config: {
    clientId: 'global-client-id',
    clientSecret: 'global-client-secret',
    tokenUrl: 'https://auth.example.com/oauth/token',
    grantType: 'client_credentials'
  }
})

const apiService = builder.build(ApiService)
```

### Method-level OAuth2 Overrides

```typescript
@OAuth2.Service({
  clientId: 'default-client',
  clientSecret: 'default-secret',
  tokenUrl: 'https://auth.example.com/oauth/token',
  scope: 'read'
})
export class ApiService extends Service {
  @GET('/admin/users')
  @OAuth2.Method({ scope: 'admin' })
  async getAdminUsers() {
    // Uses same client but with admin scope
  }

  @GET('/public/info')
  @OAuth2.Method({ skipAuth: true })
  async getPublicInfo() {
    // No authentication required
  }
}
```

## Configuration Options

### OAuth2ServiceConfig

```typescript
interface OAuth2ServiceConfig {
  clientId: string              // OAuth2 client ID
  clientSecret: string          // OAuth2 client secret
  tokenUrl: string             // Token endpoint URL
  grantType?: OAuth2GrantType  // Grant type (default: 'client_credentials')
  scope?: string               // OAuth2 scope
  autoRefresh?: boolean        // Enable automatic token refresh
  refreshThreshold?: number    // Refresh threshold in milliseconds
}
```

### OAuth2MethodConfig

```typescript
interface OAuth2MethodConfig {
  scope?: string      // Override scope for this method
  skipAuth?: boolean  // Skip authentication for this method
}
```

## Supported Grant Types

Currently supported OAuth2 grant types:

- `client_credentials` - Client credentials flow (default)
- `authorization_code` - Authorization code flow (planned)
- `refresh_token` - Token refresh flow (automatic)

## Token Management

The OAuth2 client automatically:

1. **Acquires tokens** on first request
2. **Stores tokens** in memory with expiration tracking
3. **Refreshes tokens** automatically when needed
4. **Includes Authorization header** in all authenticated requests

## Error Handling

OAuth2 authentication errors are thrown as standard errors:

```typescript
try {
  const result = await apiService.getProtectedData()
} catch (error) {
  // Handle authentication errors
  console.error('OAuth2 authentication failed:', error.message)
}
```

## Examples

### Basic Client Credentials Flow

```typescript
import { ServiceBuilder, Service, GET, OAuth2, UrlSuffix } from 'kaqi'

@UrlSuffix('/api')
@OAuth2.Service({
  clientId: 'my-app',
  clientSecret: 'super-secret',
  tokenUrl: 'https://auth.myapi.com/token'
})
class MyApiService extends Service {
  @GET('/protected-resource')
  async getResource() {}
}

const builder = new ServiceBuilder({
  host: 'api.myservice.com',
  secure: true
})

const service = builder.build(MyApiService)
const data = await service.getResource() // Automatically authenticated
```

### Mixed Authentication Requirements

```typescript
@OAuth2.Service({
  clientId: 'app-id',
  clientSecret: 'app-secret',
  tokenUrl: 'https://oauth.provider.com/token',
  scope: 'basic'
})
class MixedApiService extends Service {
  @GET('/profile')
  async getProfile() {
    // Requires basic scope authentication
  }

  @GET('/admin/settings')
  @OAuth2.Method({ scope: 'admin' })
  async getAdminSettings() {
    // Requires admin scope (overrides service scope)
  }

  @GET('/health')
  @OAuth2.Method({ skipAuth: true })
  async getHealth() {
    // Public endpoint, no authentication
  }
}
```
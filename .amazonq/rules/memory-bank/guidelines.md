# CyberJab Admin - Development Guidelines

## Code Quality Standards

### TypeScript Usage
- **Strict typing**: All files use TypeScript with explicit type annotations
- **Interface definitions**: Use `any` type sparingly, prefer specific interfaces
- **Optional chaining**: Use `?.` for safe property access (e.g., `error?.data?.error`)
- **Null checks**: Always validate token existence before API calls

### Naming Conventions
- **Functions**: camelCase with descriptive verbs (`getInstructors`, `createModule`, `toggleStatus`)
- **Variables**: camelCase with clear intent (`accessTokenCookie`, `refreshTokenCookie`)
- **Files**: kebab-case for components, camelCase for composables (`useAuth.ts`, `module-card.vue`)

### Code Organization
- **Single responsibility**: Each composable handles one domain (auth, instructors, modules)
- **Consistent exports**: Always export as named functions from composables
- **Error handling**: Standardized `{ data, error }` return pattern across all API functions
- **Token management**: Centralized authentication through `useAuth` composable

## API Integration Patterns

### Composable Structure (9/9 files follow this pattern)
```typescript
export const useFeature = () => {
  const config = useRuntimeConfig();
  const { getAccessToken } = useAuth();
  
  const apiFunction = async (params) => {
    const token = getAccessToken();
    if (!token) {
      return { error: "No access token available", data: null };
    }
    
    try {
      const res = await $fetch(url, options);
      return { data: res, error: null };
    } catch (error: any) {
      return { error: error?.data?.error || "Fallback message", data: null };
    }
  };
  
  return { apiFunction };
};
```

### HTTP Request Standards
- **Headers**: Always include `Content-Type: application/json` and `Authorization: Bearer ${token}`
- **Credentials**: Include `credentials: "include"` for all requests
- **Error handling**: Use optional chaining for error messages with fallbacks
- **File uploads**: Switch to FormData and omit Content-Type header for file operations

### Query Parameters
- **Pagination**: Standard `page` and `page_size` parameters
- **Filtering**: Use `published` boolean field (true/false) or 'all' for all modules
- **Ordering**: Dynamic ordering via `ordering` parameter (e.g., `name`, `-created_at`, `-updated_at`)

### Module API Fields
- **instructor**: Object with id, name, email (nullable)
- **plans**: Array of subscription plan objects (can be empty)
- **photo**: String URL for module cover image (nullable)
- **published**: Boolean field for publication status

## State Management Patterns

### Pinia Store Structure
- **Minimal state**: Keep only essential user data (`user`, `isAuthenticated`, `token`)
- **Clear actions**: Provide `setUser()` and `clearAuth()` methods
- **No getters**: Direct state access preferred for simplicity

### Cookie Management
- **Dual storage**: Store tokens in both cookies and Pinia store
- **Security settings**: Configure `httpOnly: false`, `secure: false` (dev), `sameSite: "lax"`
- **Expiration**: 7 days for access tokens, 30 days for refresh tokens

## Authentication Flow

### Middleware Implementation
- **Server-side skip**: Always return early on `import.meta.server`
- **Store initialization**: Wrap store access in try-catch blocks
- **Token refresh**: Automatic refresh when access token missing but refresh token present
- **Route protection**: Redirect to `/login?message=access_required` for unauthorized access

### Token Lifecycle
1. **Initialize**: Sync cookie values to store on app start
2. **Validate**: Check token before each API call
3. **Refresh**: Automatic refresh using refresh token
4. **Clear**: Remove all auth data on logout or refresh failure

## Configuration Standards

### Nuxt Configuration
- **Module order**: Core modules first (`@nuxtjs/tailwindcss`, `@nuxt/icon`), then feature modules
- **Runtime config**: Use `public` section for client-accessible values
- **CSS imports**: Global styles in `css` array, component styles scoped

### Tailwind Customization
- **Color system**: Custom color palette with semantic names (`darkBackground`, `primaryBlue`)
- **Content paths**: Include all Vue files and component directories
- **Extensions**: Extend default theme rather than replacing

## Plugin Integration

### Client-side Plugins
- **Component registration**: Register third-party components globally
- **Type safety**: Use proper TypeScript annotations for plugin parameters
- **Naming**: Use descriptive filenames with `.client.js` suffix for client-only plugins

## Error Handling Conventions

### Consistent Error Format
- **Return structure**: Always return `{ data: null, error: string }` on failure
- **Success structure**: Always return `{ data: any, error: null }` on success
- **Error messages**: Provide user-friendly fallback messages
- **Error chaining**: Use `error?.data?.error || "Fallback message"` pattern

### Authentication Errors
- **Token validation**: Check token existence before all API calls
- **Refresh attempts**: Try token refresh once before failing
- **Cleanup**: Clear all auth data when refresh fails
- **User feedback**: Provide clear error messages for auth failures
# CyberJab Admin - Project Structure

## Directory Organization

### Core Application (`/app`)
- **`assets/css/`** - Global stylesheets and Tailwind CSS configuration
- **`components/`** - Reusable Vue components organized by feature
  - `dashboard/` - Dashboard-specific components (cards, charts, metrics)
  - `global/` - Shared components (navbar, modals, data tables, editor)
  - `learning-path/` - Learning path management components
  - `modules/` - Module creation and editing components
- **`composables/`** - Vue composables for business logic and API interactions
- **`layouts/`** - Page layout templates (auth, default)
- **`middleware/`** - Route guards and authentication middleware
- **`pages/`** - File-based routing structure matching application features
- **`stores/`** - Pinia state management stores

### Configuration & Build
- **`plugins/`** - Nuxt plugins for third-party integrations
- **`public/`** - Static assets (images, icons, favicon)
- **`.nuxt/`** - Generated build files and type definitions

## Architectural Patterns

### Component Architecture
- **Feature-based organization**: Components grouped by business domain
- **Composition API**: Modern Vue 3 patterns with composables
- **Global components**: Shared UI elements accessible throughout the app

### State Management
- **Pinia stores**: Centralized state for user authentication and data
- **Composables**: Encapsulated business logic for API interactions

### Routing Structure
- **File-based routing**: Automatic route generation from pages directory
- **Nested routes**: Organized by feature areas (instructors, modules, users)
- **Dynamic routes**: Slug-based routing for detailed views

### API Integration
- **Composables pattern**: Dedicated composables for each API domain
- **Centralized configuration**: Runtime config for API endpoints and tokens
- **Type safety**: TypeScript throughout for better development experience
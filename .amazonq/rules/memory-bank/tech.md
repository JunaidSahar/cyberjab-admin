# CyberJab Admin - Technology Stack

## Core Technologies
- **Framework**: Nuxt.js 4.1.1 (Vue 3.5.21)
- **Language**: TypeScript with full type safety
- **Package Manager**: Bun (with npm/pnpm/yarn support)
- **Node Version**: Compatible with latest LTS

## Key Dependencies

### UI & Styling
- **@nuxtjs/tailwindcss** (6.14.0) - Utility-first CSS framework
- **@nuxt/icon** (2.0.0) - Icon system with multiple icon sets
- **@nuxt/fonts** (0.11.4) - Font optimization and loading

### Content & Editing
- **nuxt-tiptap-editor** (2.3.1) - Rich text editor integration
- **@tiptap/extension-*** - Text editing extensions (image, link, lists, alignment)

### State & Data
- **@pinia/nuxt** (0.11.2) - State management
- **pinia** (3.0.3) - Vue store library

### UI Components & Interactions
- **vuedraggable** (4.1.0) - Drag and drop functionality
- **nuxt-charts** (0.2.4) - Chart and visualization components

## Development Commands

### Setup
```bash
# Install dependencies
bun install
# or npm install / pnpm install / yarn install
```

### Development
```bash
# Start dev server (http://localhost:3000)
bun run dev
# or npm run dev / pnpm dev / yarn dev
```

### Production
```bash
# Build for production
bun run build

# Preview production build
bun run preview
```

### Additional Commands
```bash
# Generate static site
bun run generate

# Prepare Nuxt (post-install)
bun run postinstall
```

## Configuration Files
- **nuxt.config.ts** - Main Nuxt configuration
- **tailwind.config.ts** - Tailwind CSS customization
- **tsconfig.json** - TypeScript configuration
- **package.json** - Dependencies and scripts
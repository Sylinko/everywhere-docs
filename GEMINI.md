# everywhere-docs

## Project Overview

**everywhere-docs** is a Next.js documentation site built using the [Fumadocs](https://fumadocs.dev) framework. It is designed to host documentation and legal content, leveraging MDX for content management and Tailwind CSS for styling.

### Key Technologies
*   **Framework:** Next.js 16 (App Router)
*   **Language:** TypeScript
*   **Documentation:** Fumadocs (Core, UI, MDX)
*   **Styling:** Tailwind CSS 4, Tailwind Animate
*   **Icons:** Lucide React
*   **Package Manager:** pnpm

## Building and Running

The project uses `pnpm` for dependency management.

### Commands

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts the development server on `http://localhost:3000`. |
| `pnpm build` | Builds the application for production. |
| `pnpm start` | Starts the production server. |
| `pnpm lint` | Runs ESLint to check for code quality issues. |
| `pnpm format` | Formats code using Prettier. |
| `pnpm types:check` | Runs type checking (Fumadocs generation + Next.js typegen + TSC). |

## Project Structure

### Key Directories

*   **`app/`**: Next.js App Router directory containing pages, layouts, and API routes.
    *   `app/(home)`: Landing page route group.
    *   `app/docs`: Documentation routes.
    *   `app/api`: API routes (e.g., search).
*   **`content/`**: MDX content files.
    *   `docs/`: Documentation pages.
    *   `legal/`: Legal documents (Terms, Privacy, etc.).
*   **`components/`**: Reusable React components.
*   **`lib/`**: Utility functions and configurations.
    *   `source.ts`: Configuration for loading content via Fumadocs.
    *   `i18n.ts`: Internationalization configuration.
*   **`public/`**: Static assets (images, fonts, etc.).

### Configuration Files

*   **`source.config.ts`**: Fumadocs MDX configuration. Defines content collections (`docs`, `legal`) and frontmatter schemas.
*   **`next.config.mjs`**: Next.js configuration.
*   **`app/global.css`**: Global styles and Tailwind CSS v4 theme configuration.
*   **`tsconfig.json`**: TypeScript configuration with path aliases (`@/*`).

## Development Conventions

*   **Content:** Documentation is written in MDX. Frontmatter is used for metadata.
*   **Styling:** Use Tailwind CSS utility classes. The project uses a custom Tailwind theme (v4) defined in `app/global.css` with CSS variables for dynamic theming (e.g., `--color-brand`).
*   **Components:** UI components are typically built using Radix UI primitives (via Fumadocs UI) or standard React patterns.
*   **Icons:** Use `lucide-react` for icons.
*   **Imports:** Use the `@` alias for imports relative to the project root (e.g., `import { cn } from '@/lib/cn'`).

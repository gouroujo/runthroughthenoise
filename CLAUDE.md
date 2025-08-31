# Development Guidelines for runthroughthenoise

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Run ESLint with automatic fixes

## Code Style
- **TypeScript**: Strict typing required (`strict: true`)
- **Semicolons**: Never use semicolons (ESLint enforced)
- **Quotes**: Double quotes for JSX, single for JS/TS
- **Imports**: Use absolute imports with `@/*` alias for src directory
- **Components**: Functional components with arrow syntax
- **Naming**: PascalCase for components, camelCase for variables/functions
- **Error Handling**: Use TypeScript to prevent runtime errors
- **React**: Next.js 14+ conventions, React 18+ hooks
- **Styling**: Tailwind CSS for all styling
- **Formatting**: Prettier with custom config (see .prettierrc)

## Tech Stack
- Next.js 14+
- React 18+
- TypeScript 5+
- Tailwind CSS 3+
- ESLint/Prettier
- Outstatic CMS
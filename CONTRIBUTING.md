# Contributing to SIGMA Web Client

Thank you for your interest in contributing to the SIGMA Web Client! We welcome feedback, issue reports, and pull requests from the community.

## Prerequisites

Before you begin, ensure you have:

- [Node.js v20.x or higher](https://nodejs.org/)
- [Git](https://git-scm.com/)
- A code editor (VS Code recommended)
- Running instance of the [SIGMA API Backend](https://github.com/crazylookupss/SIGMA-Beta) (for testing)

## Development Setup

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/sigma-next.git
   cd sigma-next
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your values (see [README.md](README.md#configuration) for details).

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## How to Contribute

1. **Fork the repository** and create a feature branch from `main`.
2. **Make your changes** following the project's coding conventions.
3. **Verify your changes**:
   ```bash
   npm run build    # Production build
   npm run lint     # ESLint check
   npx tsc --noEmit # TypeScript check
   ```
4. **Submit a pull request** with a clear explanation of your change.

## Code Standards

| Rule | Standard |
|------|----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| State (Server) | TanStack React Query |
| State (Client) | Zustand |
| Components | Functional components with hooks |
| Naming | PascalCase for components, camelCase for functions/variables |

## Component Conventions

- Use `cn()` from `src/lib/utils.ts` for conditional classes
- Use CVA for variant-based component styling
- Place reusable UI components in `src/components/ui/`
- Place layout components in `src/components/layout/`
- Place shared widgets in `src/components/shared/`

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

feat(ui): add loading state to Applications page
fix(auth): handle expired token refresh
docs(readme): update environment configuration
```

**Types:** `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `style`

## Pull Request Guidelines

- **Keep PRs focused** on a single feature, refinement, or bug fix.
- **Write descriptive commit messages** following the Conventional Commits specification.
- **Ensure CI passes**: Your PR must pass all automated GitHub Actions checks (build, lint, type-check, and E2E tests).
- **Vercel Previews**: If Vercel is configured, please verify your changes on the automatically generated preview deployment.
- **Documentation**: Document any new components, props, hooks, or configurations.
- **Code Hygiene**: Remove any `console.log` debug statements before submitting.
- **Visuals**: Add screenshots or screen recordings for any UI changes.

## First-Time Contributors

If this is your first time contributing to open source, we recommend checking out these resources:
- [Finding ways to contribute to open source on GitHub](https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github)
- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)

Look for issues labeled `good first issue` or `help wanted` to get started. Don't hesitate to ask questions in the issue comments!

## Reporting Issues

Open a GitHub issue using the provided templates:
- **Bug Report**: For reporting bugs
- **Feature Request**: For suggesting new features

Please do **not** report security vulnerabilities through public issues. See [SECURITY.md](SECURITY.md) for responsible disclosure.

## Useful Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint

# TypeScript
npx tsc --noEmit         # Type check without emitting
npx tsc --noEmit --watch # Type check in watch mode

# Dependencies
npm audit                # Check for security vulnerabilities
npm outdated             # Check for outdated packages
```

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). Be respectful and inclusive.

## Questions?

If you have questions about contributing, feel free to open a [Discussion](https://github.com/crazylookupss/sigma-next/discussions) or reach out to the maintainers.

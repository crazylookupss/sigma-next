# Contributing to SIGMA Web Client

Thank you for your interest in contributing to the SIGMA Web Client! We welcome feedback, issue reports, and pull requests from the community.

## How to Contribute

1. **Fork the repository** and create a feature branch from `main`.
2. **Make your changes** following the project's coding conventions.
3. **Verify your changes**:
   - Ensure the Next.js build compiles successfully with zero warnings:
     ```bash
     npm run build
     ```
   - Ensure there are no TypeScript or ESLint errors:
     ```bash
     npm run lint
     ```
4. **Submit a pull request** with a clear explanation of your change.

## Development Setup

See the **Quick Start** section in the main [README.md](README.md) for local installation steps and configuration.

### Useful Commands

```bash
# Start development server with Turbopack compiler
npm run dev

# Run TypeScript check manually
npx tsc --noEmit

# Run ESLint checker
npm run lint

# Compile a production build
npm run build
```

## Pull Request Guidelines

- Keep PRs focused on a single feature, refinement, or bug fix.
- Write descriptive commit messages (Conventional Commits are highly recommended, e.g., `feat(ui): add loading state to Applications page`).
- Document any new components, props, hooks, or configurations.
- Ensure your branch is synced with the upstream `main` branch before submitting.

## Code of Conduct

This project is committed to providing a welcoming and inclusive environment. All contributors are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).

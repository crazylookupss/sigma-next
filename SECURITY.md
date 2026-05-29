# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in SIGMA Web Client, please report it privately by contacting the maintainers directly or opening a GitHub Security Advisory.

**Do not** report security vulnerabilities through public GitHub issues.

## Response Timeline

- **Acknowledgment** within 48 hours
- **Initial assessment** within 5 business days
- **Fix timeline** communicated based on severity

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | ✅        |

## Best Practices

- **Never commit secrets** to source control. Always use `.env.local` locally and secure environment variables in production.
- Generate a strong `NEXTAUTH_SECRET` using a secure random generator:
  ```bash
  openssl rand -base64 32
  ```
- Use HTTPS for all production redirect URIs and API calls.
- Enforce strict cookie security settings in production (`secure: true` for NextAuth cookies).
- Regularly update npm dependencies to patch security vulnerabilities:
  ```bash
  npm audit
  ```
- Limit the scopes requested in `AZURE_AD_CLIENT_ID` app registrations to the bare minimum required for operations.

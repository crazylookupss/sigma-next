# Deployment

## Docker (Recommended)

### Standalone

```bash
# Build and run the web client only
docker compose up --build
```

This starts the SIGMA Web Client on port 3000.

### Full Stack

To run both the API and web client together:

```bash
# From the sigma-next directory
docker compose --profile full-stack up --build
```

This starts:
- SIGMA API on port 5107
- SIGMA Web Client on port 3000

### Environment Variables

Create a `.env` file in the project root for Docker:

```env
# Required
NEXTAUTH_SECRET=your-secret-here
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret
AZURE_AD_TENANT_ID=your-tenant-id

# Optional (defaults shown)
NEXT_PUBLIC_API_URL=http://localhost:5107
NEXTAUTH_URL=http://localhost:3000
```

## Vercel

1. Push your fork to GitHub.
2. Import the repository in [Vercel](https://vercel.com/new).
3. Set environment variables in the Vercel dashboard.
4. Deploy.

Vercel will automatically detect Next.js and configure the build.

## Manual Deployment

```bash
# Install dependencies
npm ci

# Build for production
npm run build

# Start the production server
npm start
```

The app will start on `http://localhost:3000`.

## Build Output

Next.js 16 with `output: 'standalone'` produces a self-contained build in `.next/standalone/` that can be deployed without `node_modules`.

## Reverse Proxy

When deploying behind a reverse proxy (nginx, Caddy, etc.), ensure:

1. WebSocket connections to `/hubs/sigma` are proxied correctly.
2. The `X-Forwarded-For` and `X-Forwarded-Proto` headers are forwarded.
3. `NEXTAUTH_URL` is set to the public URL.
4. `NEXT_PUBLIC_API_URL` points to the API backend.

### Nginx Example

```nginx
server {
    listen 443 ssl;
    server_name sigma.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /hubs/sigma {
        proxy_pass http://localhost:5107/hubs/sigma;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

## CI/CD (GitHub Actions)

The CI pipeline runs on every push to `main` and on pull requests:

| Step | Description |
|------|-------------|
| TypeScript check | `npx tsc --noEmit` |
| Lint | `npm run lint` |
| Build | `npm run build` |
| E2E tests | Playwright smoke tests (Chromium) |

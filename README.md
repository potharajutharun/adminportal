# Admin Portal

Next.js admin client that uses a centralized auth server.

## Required env vars

Create `.env.local`:

```bash
NEXT_PUBLIC_AUTH_API_BASE=http://localhost:4000/api/v1
NEXT_PUBLIC_AUTH_TENANT_ID=12
```

Notes:
- `NEXT_PUBLIC_AUTH_API_BASE` points to the shared auth server.
- `NEXT_PUBLIC_AUTH_TENANT_ID` is the default tenant for register/google login.
- You can override tenant per request via `?tenant_id=<id>` on login/register URLs.

## Auth contract used by client

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/refreshtoken`
- `POST /auth/logout`
- `GET /auth/google?tenant_id=<id>`
- OAuth redirects expected by client:
  - `/auth/success`
  - `/auth/error?reason=...`

## Run

```bash
npm run dev
```

Open `http://localhost:3000`.

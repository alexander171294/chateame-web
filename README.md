# chateame-web

Frontend for **chateame** — a chat-first SaaS that auto-answers Instagram/Facebook DMs for small businesses (PyMEs).

## Tech stack

- Next.js 15 (App Router) + TypeScript + React 19
- Tailwind CSS v4 (CSS-first)
- next-intl (i18n: es-AR, es, en, pt-BR)
- TanStack Query
- Cloudflare Pages via @opennextjs/cloudflare

## Getting started

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_URL to your chateame-api URL

# Start development server
pnpm dev
```

## Available commands

| Command | Description |
|---|---|
| `pnpm dev` | Start Next.js development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | TypeScript type check |
| `pnpm preview` | Build for Cloudflare + preview locally |
| `pnpm deploy` | Deploy to Cloudflare Pages |

## Environment variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000   # chateame-api base URL
```

## Deploy to Cloudflare Pages

1. Set up your Cloudflare account and create a Pages project named `chateame-web`.
2. Configure `wrangler.toml` with your project settings.
3. Run `pnpm deploy`.

Or connect your GitHub repo to Cloudflare Pages and set the build command to `pnpm build` and output directory to `.next`.

## i18n

UI language is switcheable via the language selector in the header. Supported locales:
- `es-AR` (default — Argentine Spanish)
- `es` (Spanish)
- `en` (English)
- `pt-BR` (Brazilian Portuguese)

To add a new language, just create `messages/<locale>.json` — no code changes needed.

Note: UI language is independent of the bot's response language (`content_language`), which is managed by the backend.

## Project structure

See `CLAUDE.md` for the full project context and architecture documentation.

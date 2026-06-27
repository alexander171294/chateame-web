# CLAUDE.md — chateame-web

Contexto de proyecto para Claude Code. Leer antes de generar código.

## Qué es este repo

Frontend de **chateame**: SaaS chat-first donde una PyME conecta sus redes sociales, se auto-onboardea conversacionalmente y administra sus respuestas automáticas. Habla con el backend `chateame-api` (repo aparte). Spec funcional completa en `chateame-api/docs/spec-mvp-asistente-pymes.md` — **es la fuente de verdad**.

**Principio rector: time-to-value.** El usuario conecta → ve respuestas funcionando → recién ahí paga. Cada decisión de UI se subordina a reducir fricción hasta el "aha". Demo-first, interacción core en ~10 segundos.

## Stack

- **Next.js 15 App Router + TypeScript + React 19**.
- **Tailwind CSS v4** (CSS-first via `@tailwindcss/postcss`). NO hex sueltos en componentes — siempre `var(--color-...)`.
- **next-intl** para i18n con routing localizado (`/[locale]/...`).
- **TanStack Query** para server state.
- Deploy: **Cloudflare Pages** via `@opennextjs/cloudflare`.
- Package manager: **pnpm**.

## Estructura

```
chateame-web/
  src/
    app/
      [locale]/          # rutas localizadas
        page.tsx         # home / connect
        layout.tsx       # locale layout con NextIntlClientProvider
        providers.tsx    # QueryClientProvider
        connect/         # ConnectPage (IG/FB/WA buttons)
        onboarding/      # FAQs propuestas + chat + switch
        conversations/   # historial para moderar + escalaciones
        knowledge-base/  # CRUD FAQs + system prompt editor
        billing/         # plan, uso, checkout
    components/
      chat/              # ChatInput, MessageBubble, SuggestionButtons
      ui/                # Button, Input, Switch, Tooltip, LoadingSpinner
      layout/            # AppHeader, AppShell, LanguageSelector, ThemeToggle
    lib/
      api.ts             # typed fetch client (chateame-api)
      types.ts           # shared TS types
      query-client.ts    # TanStack Query client
    i18n/
      routing.ts         # defineRouting (locales, defaultLocale)
      request.ts         # getRequestConfig (next-intl server)
      navigation.ts      # createNavigation helpers
    styles/
      tokens.css         # CSS custom properties (branding tokens)
  messages/
    es-AR.json           # default locale
    es.json
    en.json
    pt-BR.json
  middleware.ts          # next-intl middleware (locale detection)
```

## Comandos

```bash
pnpm install
pnpm dev          # Next.js dev server
pnpm build        # Next.js production build
pnpm typecheck    # tsc --noEmit
pnpm lint         # next lint
pnpm preview      # opennextjs-cloudflare build && preview
pnpm deploy       # opennextjs-cloudflare deploy
```

## i18n (requisito duro)

**Dos ejes de idioma — NO mezclar:**
- **UI**: lo que ve el dueño (este repo). Locales: `es-AR` (default), `es`, `en`, `pt-BR`.
- **Bot**: lo que responde al cliente final. Lo maneja el backend (`content_language`). No tocar acá.

Reglas:
- **Cero strings hardcodeadas** en componentes. Todo via `useTranslations()` / `t('key')`.
- Agregar `fr`/`it`/`de` = solo sumar `messages/fr.json` sin tocar código.
- Selector de idioma en el header. Detección por middleware (Accept-Language). Preferencia en cookie `NEXT_LOCALE`.

## Branding tokens (Tercer Piso)

```css
--color-green:  #1dab68   /* primario / éxito / CTA */
--color-violet: #685EFC   /* acento */
--color-red:    #C34040   /* error / destructivo */
--bg-light:     #F8FCFE
--bg-dark:      #16242D
font: Montserrat
```

Modo claro/oscuro con esos fondos. Light/dark toggle via `data-theme="dark"` en `<html>`.

## API client

Typed fetch client en `src/lib/api.ts` apuntando a `NEXT_PUBLIC_API_URL` (default: `http://localhost:3000`). Siempre `credentials: 'include'`. La app DEBE renderizar aunque el backend no esté corriendo (loading/empty states, no crashes).

## UX (no negociable)

- **Connect page**: 3 botones grandes. WhatsApp grisado con tooltip.
- **Mobile-first**. Viewport chico primero.
- **Onboarding conversacional**: FAQs con edición inline (pencil → textarea → save).
- **Switch Activar respuestas**: visible, default OFF.
- **Chat input siempre presente** en páginas autenticadas.
- Accesibilidad: focus rings, labels, contraste, sin texto < 12px.

## Qué NO construir (scope MVP)

- Flujo self-serve de WhatsApp (solo botón grisado).
- Pantallas de CRM / historial de clientes / memoria.
- Dashboards de analytics pesados.
- Editor visual de flujos.

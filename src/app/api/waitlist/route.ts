import { getCloudflareContext } from '@opennextjs/cloudflare';

export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Interfaz mínima de D1 para no depender de @cloudflare/workers-types.
interface D1Like {
  prepare(query: string): {
    bind(...values: unknown[]): { run(): Promise<unknown> };
  };
}

export async function POST(request: Request): Promise<Response> {
  let body: { email?: string; source?: string };
  try {
    body = (await request.json()) as { email?: string; source?: string };
  } catch {
    return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const email = (body.email ?? '').trim().toLowerCase();
  const source = (body.source ?? '').slice(0, 32);

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return Response.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }

  try {
    const { env } = getCloudflareContext();
    const db = (env as unknown as { WAITLIST_DB?: D1Like }).WAITLIST_DB;
    if (!db) {
      return Response.json({ ok: false, error: 'db_unavailable' }, { status: 503 });
    }
    await db
      .prepare(
        'INSERT INTO waitlist (email, source, created_at) VALUES (?, ?, ?) ON CONFLICT(email) DO NOTHING',
      )
      .bind(email, source || null, new Date().toISOString())
      .run();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: 'db_error' }, { status: 500 });
  }
}

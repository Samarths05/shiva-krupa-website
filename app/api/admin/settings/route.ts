import { requireAdminApi } from "../../../../lib/admin-auth";

export async function GET() {
  if (!(await requireAdminApi())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { env } = await import("cloudflare:workers");
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS site_settings (id INTEGER PRIMARY KEY, data TEXT NOT NULL DEFAULT '{}', updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
  const row = await env.DB.prepare("SELECT data FROM site_settings WHERE id = 1").first<{data:string}>();
  return Response.json({ settings: row?.data ? JSON.parse(row.data) : {} });
}
export async function POST(request: Request) {
  if (!(await requireAdminApi())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const settings = await request.json();
  const { env } = await import("cloudflare:workers");
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS site_settings (id INTEGER PRIMARY KEY, data TEXT NOT NULL DEFAULT '{}', updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
  await env.DB.prepare("INSERT INTO site_settings (id, data, updated_at) VALUES (1, ?, CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP").bind(JSON.stringify(settings)).run();
  return Response.json({ ok: true });
}

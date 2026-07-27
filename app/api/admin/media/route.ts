import { requireAdminApi } from "../../../../lib/admin-auth";
export async function POST(request: Request) {
  if (!(await requireAdminApi())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || !file.type.startsWith("image/")) return Response.json({ error: "Select an image." }, { status: 400 });
  if (file.size > 8_000_000) return Response.json({ error: "Image must be under 8 MB." }, { status: 400 });
  const ext = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
  const key = `images/${crypto.randomUUID()}.${ext}`;
  const { env } = await import("cloudflare:workers");
  await env.BUCKET.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
  return Response.json({ url: `/media/${key}` });
}

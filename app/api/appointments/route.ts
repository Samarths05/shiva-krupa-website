import { getDb } from "../../../db";
import { appointments } from "../../../db/schema";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, string>;
    const name = payload.name?.trim();
    const phone = payload.phone?.trim();
    const service = payload.service?.trim();
    if (!name || !phone || !service) {
      return Response.json({ error: "Name, phone and service are required." }, { status: 400 });
    }
    const db = await getDb();
    const [appointment] = await db.insert(appointments).values({
      name,
      phone,
      service,
      preferredDate: payload.preferredDate?.trim() || null,
      preferredTime: payload.preferredTime?.trim() || null,
      message: payload.message?.trim() || null,
    }).returning();
    return Response.json({ appointment }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to save appointment." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    if (!sessionToken) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const session = await db.session.findUnique({ where: { token: sessionToken }, include: { user: true } });
    if (!session || session.expiresAt < new Date()) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const data = await req.json();
    const address = await db.address.create({ data: { ...data, userId: session.userId } });
    return NextResponse.json(address);
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

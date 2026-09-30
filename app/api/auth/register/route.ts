import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "البريد الإلكتروني مسجل مسبقاً" }, { status: 400 });

    const hashedPassword = await hash(password, 12);
    const user = await db.user.create({ data: { name, email, password: hashedPassword, phone, role: "customer" } });

    const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "secret");
    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("30d")
      .sign(secret);

    await db.session.create({
      data: { token, userId: user.id, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    });

    const cookieStore = await cookies();
    cookieStore.set("session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 30 * 24 * 60 * 60, path: "/" });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

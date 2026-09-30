import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { compare } from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const user = await db.user.findUnique({ where: { email } });
    
    if (!user) return NextResponse.json({ error: "البريد أو كلمة المرور غير صحيحة" }, { status: 401 });
    
    const valid = await compare(password, user.password);
    if (!valid) return NextResponse.json({ error: "البريد أو كلمة المرور غير صحيحة" }, { status: 401 });

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

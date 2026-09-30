import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ user: null, orders: [], addresses: [] });
    }

    const session = await db.session.findUnique({
      where: { token: sessionToken },
      include: {
        user: {
          include: {
            orders: {
              orderBy: { createdAt: "desc" },
              take: 10,
              include: { items: { include: { product: true } } },
            },
            addresses: true,
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ user: null, orders: [], addresses: [] });
    }

    const { user } = session;
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
      orders: user.orders.map((o) => ({
        id: o.id, number: o.number, total: o.total, status: o.status, createdAt: o.createdAt,
        items: o.items.map((i) => ({ name: i.product.nameAr, qty: i.qty, price: i.price })),
      })),
      addresses: user.addresses,
    });
  } catch (error) {
    return NextResponse.json({ user: null, orders: [], addresses: [] });
  }
}

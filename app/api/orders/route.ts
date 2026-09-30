import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { items, customer, couponCode, paymentMethod } = await req.json();
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    let userId: string | null = null;

    if (sessionToken) {
      const session = await db.session.findUnique({ where: { token: sessionToken } });
      if (session && session.expiresAt >= new Date()) userId = session.userId;
    }

    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await db.product.findUnique({ where: { id: item.productId } });
      if (!product || product.stock < item.qty) {
        return NextResponse.json({ error: `المنتج "${product?.nameAr || ""}" غير متوفر` }, { status: 400 });
      }
      subtotal += product.price * item.qty;
      orderItems.push({ productId: item.productId, qty: item.qty, price: product.price });
    }

    let discount = 0;
    if (couponCode) {
      const coupon = await db.coupon.findUnique({ where: { code: couponCode.toUpperCase(), isActive: true } });
      if (coupon) {
        if (coupon.type === "percentage") {
          discount = Math.round((subtotal * coupon.value) / 100);
          if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
        } else {
          discount = coupon.value;
        }
      }
    }

    const settings = await db.setting.findFirst({ include: { shipping: { include: { cities: true } } } });
    let shippingFee = Number(settings?.shipping.defaultFee || 15);
    const city = settings?.shipping.cities.find((c) => c.name === customer.city);
    if (city) shippingFee = Number(city.fee);
    if (settings?.shipping.freeShippingEnabled && subtotal - discount >= Number(settings.shipping.freeShippingMin || 200)) {
      shippingFee = 0;
    }

    const total = subtotal - discount + shippingFee;
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    await db.order.create({
      data: {
        number: orderNumber, userId, customerName: customer.name, customerPhone: customer.phone,
        customerEmail: customer.email, shippingCity: customer.city, shippingAddress: customer.address,
        shippingNotes: customer.notes, paymentMethod, subtotal, discount, shipping: shippingFee, total, status: "new",
        items: { create: orderItems },
      },
    });

    for (const item of items) {
      await db.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.qty } } });
    }

    return NextResponse.json({ success: true, orderNumber, total });
  } catch (error) {
    return NextResponse.json({ error: "فشل إنشاء الطلب" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();
    const coupon = await db.coupon.findUnique({ where: { code: code.toUpperCase() } });

    if (!coupon || !coupon.isActive) return NextResponse.json({ error: "كوبون غير صالح" }, { status: 400 });
    
    const now = new Date();
    if ((coupon.startsAt && coupon.startsAt > now) || (coupon.endsAt && coupon.endsAt < now)) {
      return NextResponse.json({ error: "كوبون منتهي الصلاحية" }, { status: 400 });
    }
    if (coupon.minAmount && subtotal < coupon.minAmount) {
      return NextResponse.json({ error: `الحد الأدنى ${coupon.minAmount} ر.س` }, { status: 400 });
    }

    let discount = 0;
    if (coupon.type === "percentage") {
      discount = Math.round((subtotal * coupon.value) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
    } else {
      discount = coupon.value;
    }
    if (discount > subtotal) discount = subtotal;

    return NextResponse.json({ discount, success: true });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

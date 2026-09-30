import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
  const products = await db.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true, brand: true, images: { where: { isMain: true }, take: 1 } },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (!token) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const data = await req.json();
    const { images, colors, specifications, ...productData } = data;

    const product = await db.product.create({
      data: {
        ...productData,
        slug: (productData.nameAr || 'product').replace(/\s+/g, '-').toLowerCase() + '-' + Date.now(),
        colors: colors || [],
        specifications: specifications || [],
        images: { create: images || [] },
      },
    });
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

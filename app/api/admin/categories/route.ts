import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const categories = await db.category.findMany({ where: { isActive: true }, orderBy: { nameAr: 'asc' } });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const category = await db.category.create({
      data: {
        ...data,
        slug: data.nameAr.replace(/\s+/g, '-').toLowerCase(),
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}

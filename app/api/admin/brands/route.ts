import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const brands = await db.brand.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  return NextResponse.json(brands);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const brand = await db.brand.create({ data });
    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}

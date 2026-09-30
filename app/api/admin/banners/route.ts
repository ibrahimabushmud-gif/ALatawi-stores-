import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const banners = await db.banner.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(banners);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const banner = await db.banner.create({ data });
    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}

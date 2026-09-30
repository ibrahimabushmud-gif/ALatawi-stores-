import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const settings = await db.setting.findFirst({ include: { store: true, theme: true } });
  return NextResponse.json(settings);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const existing = await db.setting.findFirst();
    if (existing?.store) {
      await db.store.update({ where: { id: existing.store.id }, data: data.store });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}

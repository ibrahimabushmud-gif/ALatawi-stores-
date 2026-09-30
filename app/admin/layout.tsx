import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('admin_session')?.value;

  if (!adminToken) {
    redirect('/admin/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <aside style={{ width: 260, background: '#1e293b', color: 'white', padding: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 30 }}>⚙️ لوحة الإدارة</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a href="/admin" style={{ padding: '10px 14px', background: '#334155', borderRadius: 8, textDecoration: 'none', color: 'white' }}>📊 لوحة التحكم</a>
          <a href="/admin/products" style={{ padding: '10px 14px', borderRadius: 8, textDecoration: 'none', color: '#cbd5e1' }}> المنتجات</a>
          <a href="/admin/orders" style={{ padding: '10px 14px', borderRadius: 8, textDecoration: 'none', color: '#cbd5e1' }}> الطلبات</a>
          <a href="/admin/categories" style={{ padding: '10px 14px', borderRadius: 8, textDecoration: 'none', color: '#cbd5e1' }}>️ التصنيفات</a>
          <a href="/admin/banners" style={{ padding: '10px 14px', borderRadius: 8, textDecoration: 'none', color: '#cbd5e1' }}>🖼️ البانرات</a>
          <a href="/admin/settings" style={{ padding: '10px 14px', borderRadius: 8, textDecoration: 'none', color: '#cbd5e1' }}>⚙️ الإعدادات</a>
          <a href="/" style={{ padding: '10px 14px', borderRadius: 8, textDecoration: 'none', color: '#cbd5e1', marginTop: 20 }}>← عرض المتجر</a>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 30 }}>{children}</main>
    </div>
  );
}

import Link from 'next/link';
import { db } from '@/lib/db';

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true, brand: true, images: { where: { isMain: true }, take: 1 } },
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>📦 إدارة المنتجات ({products.length})</h1>
        <Link href="/admin/products/new" className="btn btn-primary">+ إضافة منتج جديد</Link>
      </div>

      {products.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: '#64748b', marginBottom: 16 }}>لا توجد منتجات بعد</p>
          <Link href="/admin/products/new" className="btn btn-primary">أضف أول منتج</Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>الصورة</th>
                <th>الاسم</th>
                <th>التصنيف</th>
                <th>السعر</th>
                <th>المخزون</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img src={p.images[0]?.url || 'https://placehold.co/60'} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }} />
                  </td>
                  <td style={{ fontWeight: 700 }}>{p.nameAr}</td>
                  <td>{p.category?.nameAr || '-'}</td>
                  <td className="price">{p.price} ر.س</td>
                  <td>{p.stock}</td>
                  <td>
                    <span className="badge" style={{ background: p.status === 'active' ? '#dcfce7' : '#fee2e2', color: p.status === 'active' ? '#166534' : '#991b1b' }}>
                      {p.status === 'active' ? 'نشط' : 'معطل'}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <Link href={`/admin/products/${p.id}/edit`} className="btn btn-sm btn-outline" style={{ padding: '4px 10px' }}>تعديل</Link>
                    <form action={`/api/admin/products/${p.id}`} method="POST">
                      <input type="hidden" name="_method" value="DELETE" />
                      <button type="submit" className="btn btn-sm btn-danger" style={{ padding: '4px 10px' }} onClick={(e) => { if (!confirm('حذف المنتج؟')) e.preventDefault(); }}>حذف</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

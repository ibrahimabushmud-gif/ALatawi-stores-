import { db } from '@/lib/db';

export default async function AdminDashboard() {
  const [orders, products, totalRevenue] = await Promise.all([
    db.order.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
    db.product.count(),
    db.order.aggregate({ _sum: { total: true } }),
  ]);

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>📊 لوحة التحكم</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 30 }}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 14, color: '#64748b', marginBottom: 8 }}>إجمالي المبيعات</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#2563eb' }}>{(totalRevenue._sum.total || 0).toLocaleString()} ر.س</div>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 14, color: '#64748b', marginBottom: 8 }}>عدد الطلبات</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#16a34a' }}>{orders.length}</div>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 14, color: '#64748b', marginBottom: 8 }}>المنتجات</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#f59e0b' }}>{products}</div>
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>📋 آخر الطلبات</h2>
        {orders.length === 0 ? (
          <p style={{ color: '#64748b' }}>لا توجد طلبات بعد</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>العميل</th>
                <th>الإجمالي</th>
                <th>الحالة</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 700 }}>{order.number}</td>
                  <td>{order.customerName}</td>
                  <td>{order.total.toLocaleString()} ر.س</td>
                  <td><span className="badge badge-gray">{order.status}</span></td>
                  <td>{new Date(order.createdAt).toLocaleDateString('ar')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

import { db } from '@/lib/db';

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({ orderBy: { createdAt: 'desc' } });

  async function updateStatus(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const status = formData.get('status') as string;
    await db.order.update({ where: { id }, data: { status } });
  }

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>📋 إدارة الطلبات ({orders.length})</h1>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>رقم الطلب</th>
              <th>العميل</th>
              <th>الهاتف</th>
              <th>الإجمالي</th>
              <th>الحالة</th>
              <th>التاريخ</th>
              <th>تحديث الحالة</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: 700 }}>{order.number}</td>
                <td>{order.customerName}</td>
                <td dir="ltr">{order.customerPhone}</td>
                <td className="price">{order.total.toLocaleString()} ر.س</td>
                <td><span className="badge badge-gray">{order.status}</span></td>
                <td>{new Date(order.createdAt).toLocaleDateString('ar')}</td>
                <td>
                  <form action={updateStatus} style={{ display: 'flex', gap: 4 }}>
                    <input type="hidden" name="id" value={order.id} />
                    <select name="status" defaultValue={order.status} className="input" style={{ padding: 4, fontSize: 12 }}>
                      <option value="new">جديد</option>
                      <option value="confirmed">مؤكد</option>
                      <option value="shipped">تم الشحن</option>
                      <option value="delivered">تم التوصيل</option>
                      <option value="cancelled">ملغي</option>
                    </select>
                    <button type="submit" className="btn btn-sm btn-primary">حفظ</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

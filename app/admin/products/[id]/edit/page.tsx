"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.json()).then(setCategories);
    fetch('/api/admin/brands').then(r => r.json()).then(setBrands);
    fetch(`/api/admin/products/${params.id}`).then(r => r.json()).then(setForm);
  }, [params.id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/admin/products/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        stock: Number(form.stock),
      }),
    });
    setLoading(false);
    if (res.ok) {
      alert('تم تحديث المنتج!');
      router.push('/admin/products');
    } else {
      alert('حدث خطأ');
    }
  }

  if (!form.nameAr) return <div>جارٍ التحميل...</div>;

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>✏️ تعديل المنتج</h1>
      <form onSubmit={submit} className="card" style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={inputStyle}>
          <label className="label">اسم المنتج (عربي) *</label>
          <input className="input" required value={form.nameAr || ''} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
        </div>
        <div style={inputStyle}>
          <label className="label">السعر (ر.س) *</label>
          <input className="input" type="number" required value={form.price || ''} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </div>
        <div style={inputStyle}>
          <label className="label">المخزون *</label>
          <input className="input" type="number" required value={form.stock || ''} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        </div>
        <div style={inputStyle}>
          <label className="label">التصنيف</label>
          <select className="input" value={form.categoryId || ''} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
            <option value="">-- اختر --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, marginTop: 16 }}>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
            {loading ? 'جارٍ الحفظ...' : '💾 حفظ التعديلات'}
          </button>
          <button type="button" className="btn btn-gray" onClick={() => router.back()}>إلغاء</button>
        </div>
      </form>
    </div>
  );
}
const inputStyle = { marginBottom: 12 };

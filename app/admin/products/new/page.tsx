"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nameAr: '', nameEn: '', description: '', price: '', oldPrice: '', stock: '',
    sku: '', categoryId: '', brandId: '', status: 'active',
    isFeatured: false, isNew: false, isOnSale: false,
    tags: '', colors: '', specifications: '',
    seoTitle: '', seoDescription: '',
    imageUrls: '', // URLs separated by comma
  });

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.json()).then(setCategories);
    fetch('/api/admin/brands').then(r => r.json()).then(setBrands);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        stock: Number(form.stock),
        images: form.imageUrls.split(',').map((url, i) => ({ url: url.trim(), isMain: i === 0 })),
        colors: form.colors ? form.colors.split(',').map(c => c.trim()) : [],
        specifications: form.specifications ? JSON.parse(form.specifications) : [],
      }),
    });
    setLoading(false);
    if (res.ok) {
      alert('تم إضافة المنتج بنجاح!');
      router.push('/admin/products');
    } else {
      const data = await res.json();
      alert(data.error || 'حدث خطأ');
    }
  }

  const inputStyle = { marginBottom: 12 };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}> إضافة منتج جديد</h1>
      <form onSubmit={submit} className="card" style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ gridColumn: '1 / -1', fontSize: 16, fontWeight: 700, borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>📝 المعلومات الأساسية</div>
        
        <div style={inputStyle}>
          <label className="label">اسم المنتج (عربي) *</label>
          <input className="input" required value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
        </div>
        <div style={inputStyle}>
          <label className="label">اسم المنتج (إنجليزي)</label>
          <input className="input" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
        </div>

        <div style={{ gridColumn: '1 / -1', ...inputStyle }}>
          <label className="label">الوصف</label>
          <textarea className="input" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        <div style={inputStyle}>
          <label className="label">السعر (ر.س) *</label>
          <input className="input" type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </div>
        <div style={inputStyle}>
          <label className="label">السعر القديم (اختياري)</label>
          <input className="input" type="number" step="0.01" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} />
        </div>

        <div style={inputStyle}>
          <label className="label">المخزون *</label>
          <input className="input" type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        </div>
        <div style={inputStyle}>
          <label className="label">SKU (رمز المنتج)</label>
          <input className="input" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
        </div>

        <div style={inputStyle}>
          <label className="label">التصنيف *</label>
          <select className="input" required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
            <option value="">-- اختر تصنيف --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
          </select>
        </div>
        <div style={inputStyle}>
          <label className="label">الماركة</label>
          <select className="input" value={form.brandId} onChange={(e) => setForm({ ...form, brandId: e.target.value })}>
            <option value="">-- اختر ماركة --</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        <div style={{ gridColumn: '1 / -1', fontSize: 16, fontWeight: 700, borderBottom: '1px solid #e2e8f0', paddingBottom: 8, marginTop: 8 }}>🖼️ الصور</div>
        <div style={{ gridColumn: '1 / -1', ...inputStyle }}>
          <label className="label">روابط الصور (افصل بينها بفاصلة) *</label>
          <textarea className="input" rows={2} required placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" value={form.imageUrls} onChange={(e) => setForm({ ...form, imageUrls: e.target.value })} />
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>الصورة الأولى ستكون الصورة الرئيسية</div>
        </div>

        <div style={{ gridColumn: '1 / -1', fontSize: 16, fontWeight: 700, borderBottom: '1px solid #e2e8f0', paddingBottom: 8, marginTop: 8 }}>🏷️ التصنيفات الخاصة</div>
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
            <span>⭐ منتج مميز</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} />
            <span>🆕 منتج جديد</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="checkbox" checked={form.isOnSale} onChange={(e) => setForm({ ...form, isOnSale: e.target.checked })} />
            <span>💰 على تخفيض</span>
          </label>
        </div>

        <div style={inputStyle}>
          <label className="label">الحالة</label>
          <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="active">نشط</option>
            <option value="draft">مسودة</option>
            <option value="archived">مؤرشف</option>
          </select>
        </div>
        <div style={inputStyle}>
          <label className="label">التاجات (افصل بفاصلة)</label>
          <input className="input" placeholder="هاتف, سامسونج, 5G" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        </div>

        <div style={inputStyle}>
          <label className="label">الألوان (افصل بفاصلة)</label>
          <input className="input" placeholder="أسود, أبيض, أزرق" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} />
        </div>
        <div style={inputStyle}>
          <label className="label">المواصفات (JSON)</label>
          <textarea className="input" rows={2} placeholder='[{"key":"الذاكرة","value":"128GB"}]' value={form.specifications} onChange={(e) => setForm({ ...form, specifications: e.target.value })} />
        </div>

        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, marginTop: 16 }}>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
            {loading ? 'جارٍ الحفظ...' : '💾 حفظ المنتج'}
          </button>
          <button type="button" className="btn btn-gray" onClick={() => router.back()}>إلغاء</button>
        </div>
      </form>
    </div>
  );
}

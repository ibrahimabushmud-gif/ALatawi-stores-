"use client";
import { useState, useEffect } from 'react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');

  const load = () => fetch('/api/admin/categories').then(r => r.json()).then(setCategories);
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nameAr: name, isActive: true }),
    });
    setName('');
    load();
  }

  async function remove(id: string) {
    if (!confirm('حذف التصنيف؟')) return;
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>🏷️ إدارة التصنيفات</h1>
      <form onSubmit={add} className="card" style={{ padding: 20, display: 'flex', gap: 12, marginBottom: 20 }}>
        <input className="input" placeholder="اسم التصنيف الجديد" value={name} onChange={(e) => setName(e.target.value)} required style={{ flex: 1 }} />
        <button type="submit" className="btn btn-primary">+ إضافة</button>
      </form>
      <div className="card" style={{ padding: 0 }}>
        <table className="table">
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 700 }}>{c.nameAr}</td>
                <td dir="ltr" style={{ color: '#64748b' }}>{c.slug}</td>
                <td><button className="btn btn-sm btn-danger" onClick={() => remove(c.id)}>حذف</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

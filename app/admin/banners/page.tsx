"use client";
import { useState, useEffect } from 'react';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');

  const load = () => fetch('/api/admin/banners').then(r => r.json()).then(setBanners);
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/admin/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image, link, isActive: true, order: banners.length }),
    });
    setImage(''); setLink('');
    load();
  }

  async function remove(id: string) {
    if (!confirm('حذف البانر؟')) return;
    await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>🖼️ إدارة البانرات (السلايدر)</h1>
      <form onSubmit={add} className="card" style={{ padding: 20, display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 12, marginBottom: 20 }}>
        <input className="input" placeholder="رابط الصورة (URL)" value={image} onChange={(e) => setImage(e.target.value)} required />
        <input className="input" placeholder="رابط الوجهة (اختياري)" value={link} onChange={(e) => setLink(e.target.value)} />
        <button type="submit" className="btn btn-primary">+ إضافة</button>
      </form>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {banners.map((b) => (
          <div key={b.id} className="card" style={{ padding: 12, position: 'relative' }}>
            <img src={b.image} style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 8 }} />
            <button className="btn btn-sm btn-danger" style={{ position: 'absolute', top: 20, left: 20 }} onClick={() => remove(b.id)}>حذف</button>
          </div>
        ))}
      </div>
    </div>
  );
}

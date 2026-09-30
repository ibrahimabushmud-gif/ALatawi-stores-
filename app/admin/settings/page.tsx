"use client";
import { useState, useEffect } from 'react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [storeName, setStoreName] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then((data) => {
      setSettings(data);
      setStoreName(data?.store?.name || '');
    });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ store: { name: storeName } }),
    });
    alert('تم حفظ الإعدادات!');
  }

  if (!settings) return <div>جارٍ التحميل...</div>;

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>⚙️ إعدادات المتجر</h1>
      <form onSubmit={save} className="card" style={{ padding: 24, maxWidth: 600 }}>
        <div style={{ marginBottom: 16 }}>
          <label className="label">اسم المتجر</label>
          <input className="input" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">💾 حفظ التغييرات</button>
      </form>
    </div>
  );
}

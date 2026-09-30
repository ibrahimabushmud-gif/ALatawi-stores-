"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    router.push('/admin');
    router.refresh();
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
      <div className="card" style={{ padding: 40, width: 400 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24, textAlign: 'center' }}> دخول الإدارة</h1>
        {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: 10, borderRadius: 8, marginBottom: 16 }}>{error}</div>}
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input className="input" placeholder="البريد الإلكتروني" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input" placeholder="كلمة المرور" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button className="btn btn-primary" type="submit" style={{ fontSize: 16 }}>دخول</button>
        </form>
        <div style={{ marginTop: 20, fontSize: 13, color: '#64748b', textAlign: 'center' }}>
          البريد: admin@alatawi-store<br />
          كلمة السر: Alatawi@123456
        </div>
      </div>
    </div>
  );
}

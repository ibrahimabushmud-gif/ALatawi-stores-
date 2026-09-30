"use client";
import { useState } from 'react';

export default function ReviewForm({ productId }: { productId: string }) {
  const [form, setForm] = useState({ name: '', rating: 5, comment: '' });
  const [submitted, setSubmitted] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, productId }),
    });
    setSubmitted(true);
  }

  if (submitted) {
    return <div className="card" style={{ padding: 20, textAlign: 'center', color: '#16a34a' }}>✓ تم إرسال التقييم بنجاح</div>;
  }

  return (
    <form onSubmit={submit} className="card" style={{ padding: 20 }}>
      <h3 style={{ margin: '0 0 12px' }}>أضف تقييمك</h3>
      <input className="input" placeholder="الاسم" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ marginBottom: 10 }} />
      <div style={{ marginBottom: 10 }}>
        <label className="label">التقييم</label>
        <select className="input" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
          {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{'★'.repeat(r)}</option>)}
        </select>
      </div>
      <textarea className="input" rows={3} placeholder="تعليقك (اختياري)" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} style={{ marginBottom: 10 }} />
      <button className="btn btn-primary" style={{ width: '100%' }}>إرسال التقييم</button>
    </form>
  );
}

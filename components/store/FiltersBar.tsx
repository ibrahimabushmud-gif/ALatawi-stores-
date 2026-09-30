"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function FiltersBar({ categories, brands, current }: any) {
  const router = useRouter();
  const [f, setF] = useState({
    q: current.q || "", category: current.category || "", brand: current.brand || "",
    min: current.min || "", max: current.max || "",
    sort: current.sort || "", sale: current.sale === "1", isNew: current.isNew === "1",
  });
  useEffect(() => setF({
    q: current.q || "", category: current.category || "", brand: current.brand || "",
    min: current.min || "", max: current.max || "",
    sort: current.sort || "", sale: current.sale === "1", isNew: current.isNew === "1",
  }), [current]);

  function apply(patch: any = {}) {
    const next = { ...f, ...patch };
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.category) params.set("category", next.category);
    if (next.brand) params.set("brand", next.brand);
    if (next.min) params.set("min", next.min);
    if (next.max) params.set("max", next.max);
    if (next.sort) params.set("sort", next.sort);
    if (next.sale) params.set("sale", "1");
    if (next.isNew) params.set("isNew", "1");
    router.push("/shop?" + params.toString());
  }

  return (
    <aside className="card" style={{ padding: 16, height: "fit-content", position: "sticky", top: 130 }}>
      <label className="label">بحث</label>
      <input className="input" value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })}
        onKeyDown={(e) => e.key === "Enter" && apply()} style={{ marginBottom: 12 }} />
      <label className="label">التصنيف</label>
      <select className="input" value={f.category} onChange={(e) => apply({ category: e.target.value })} style={{ marginBottom: 12 }}>
        <option value="">الكل</option>
        {categories.map((c: any) => <option key={c.id} value={c.slug}>{c.nameAr}</option>)}
      </select>
      <label className="label">البراند</label>
      <select className="input" value={f.brand} onChange={(e) => apply({ brand: e.target.value })} style={{ marginBottom: 12 }}>
        <option value="">الكل</option>
        {brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
      </select>
      <label className="label">السعر (ر.س)</label>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <input className="input" type="number" placeholder="من" value={f.min} onChange={(e) => setF({ ...f, min: e.target.value })} />
        <input className="input" type="number" placeholder="إلى" value={f.max} onChange={(e) => setF({ ...f, max: e.target.value })} />
      </div>
      <button className="btn btn-outline btn-sm" style={{ width: "100%", marginBottom: 12 }} onClick={() => apply()}>تطبيق السعر</button>
      <label className="label">الترتيب</label>
      <select className="input" value={f.sort} onChange={(e) => apply({ sort: e.target.value })} style={{ marginBottom: 12 }}>
        <option value="">الأحدث</option>
        <option value="sales">الأكثر مبيعًا</option>
        <option value="price_asc">الأقل سعرًا</option>
        <option value="price_desc">الأعلى سعرًا</option>
      </select>
      <label style={{ display: "flex", gap: 6, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
        <input type="checkbox" checked={f.sale} onChange={(e) => apply({ sale: e.target.checked })} /> العروض فقط
      </label>
      <label style={{ display: "flex", gap: 6, fontSize: 13, fontWeight: 600 }}>
        <input type="checkbox" checked={f.isNew} onChange={(e) => apply({ isNew: e.target.checked })} /> الجديد فقط
      </label>
    </aside>
  );
}

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const STATUS_AR: Record<string, string> = {
  new: "جديد", reviewing: "قيد المراجعة", confirmed: "تم التأكيد",
  processing: "قيد التجهيز", shipped: "تم الشحن", delivered: "تم التوصيل",
  completed: "مكتمل", cancelled: "ملغي", returned: "مسترجع",
};

export default function AccountPage() {
  const [data, setData] = useState<any>(null);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [addr, setAddr] = useState({ title: "المنزل", city: "الرياض", district: "", street: "", phone: "" });

  const load = () => fetch("/api/auth/me").then((r) => (r.ok ? r.json() : { user: null })).then(setData);
  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    const res = await fetch(mode === "login" ? "/api/auth/customer-login" : "/api/auth/register", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    const d = await res.json();
    if (!res.ok) return setError(d.error);
    load();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setData({ user: null });
  }

  async function addAddress(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/addresses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(addr) });
    load();
  }

  if (!data) return <div className="container-x" style={{ padding: 40 }}>جارٍ التحميل...</div>;

  if (!data.user) return (
    <div className="container-x" style={{ padding: "40px 16px" }}>
      <div className="card" style={{ maxWidth: 420, margin: "0 auto", padding: 28 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <button className={"btn btn-sm " + (mode === "login" ? "btn-primary" : "btn-gray")} style={{ flex: 1 }} onClick={() => setMode("login")}>تسجيل الدخول</button>
          <button className={"btn btn-sm " + (mode === "register" ? "btn-primary" : "btn-gray")} style={{ flex: 1 }} onClick={() => setMode("register")}>حساب جديد</button>
        </div>
        <h2 style={{ margin: "0 0 16px", fontSize: 20 }}>{mode === "login" ? "مرحبًا بعودتك 👋" : "أنشئ حسابك"}</h2>
        {error && <div style={{ background: "#fee2e2", color: "#b91c1c", padding: 10, borderRadius: 8, marginBottom: 12, fontSize: 13 }}>{error}</div>}
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mode === "register" && <input className="input" placeholder="الاسم" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
          <input className="input" type="email" placeholder="البريد الإلكتروني" required dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" type="password" placeholder="كلمة المرور" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {mode === "register" && <input className="input" placeholder="الجوال" dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />}
          <button className="btn btn-primary">{mode === "login" ? "دخول" : "إنشاء الحساب"}</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="container-x" style={{ paddingTop: 24, display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="card" style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}> {data.user.name}</h1>
          <div style={{ color: "#64748b", fontSize: 13 }}>{data.user.email} {data.user.phone && `· ${data.user.phone}`}</div>
        </div>
        <button className="btn btn-gray btn-sm" onClick={logout}>تسجيل الخروج</button>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ margin: "0 0 14px" }}> طلباتي ({data.orders.length})</h3>
        {data.orders.length === 0 && <p style={{ color: "#94a3b8", fontSize: 13 }}>لا توجد طلبات بعد</p>}
        <table className="table">
          <tbody>
            {data.orders.map((o: any) => (
              <tr key={o.id}>
                <td style={{ fontWeight: 700 }}>{o.number}</td>
                <td style={{ fontSize: 13 }}>{o.items.map((i: any) => i.name).join("، ")}</td>
                <td className="price">{o.total} ر.س</td>
                <td><span className="badge badge-gray">{STATUS_AR[o.status] || o.status}</span></td>
                <td style={{ fontSize: 12 }}>{new Date(o.createdAt).toLocaleDateString("ar")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ margin: "0 0 14px" }}> عناويني</h3>
        {data.addresses.map((a: any) => (
          <div key={a.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9", fontSize: 14 }}>
            <span><b>{a.title}</b> - {a.city}، {a.street}</span>
            <button className="btn btn-danger btn-sm" onClick={async () => { await fetch(`/api/addresses/${a.id}`, { method: "DELETE" }); load(); }}>حذف</button>
          </div>
        ))}
        <form onSubmit={addAddress} style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
          <input className="input" style={{ width: 120 }} placeholder="العنوان (العمل...)" value={addr.title} onChange={(e) => setAddr({ ...addr, title: e.target.value })} required />
          <input className="input" style={{ width: 110 }} placeholder="المدينة" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} required />
          <input className="input" style={{ width: 140 }} placeholder="الحي" value={addr.district} onChange={(e) => setAddr({ ...addr, district: e.target.value })} />
          <input className="input" style={{ flex: 1, minWidth: 160 }} placeholder="الشارع" value={addr.street} onChange={(e) => setAddr({ ...addr, street: e.target.value })} required />
          <input className="input" style={{ width: 130 }} placeholder="الجوال" dir="ltr" value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} required />
          <button className="btn btn-outline btn-sm">+ إضافة</button>
        </form>
      </div>
    </div>
  );
}

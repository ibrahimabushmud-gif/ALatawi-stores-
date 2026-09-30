"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./cart-store";

export default function CheckoutClient({ settings }: { settings: any }) {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "", city: settings.shipping.cities[0]?.name || "", address: "", notes: "" });
  const [payment, setPayment] = useState("cod");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ number: string; total: number } | null>(null);

  const enabledPayments = Object.entries(settings.payments).filter(([, p]: any) => p.enabled);
  const city = settings.shipping.cities.find((c: any) => c.name === customer.city);
  let shipping = city ? Number(city.fee) : Number(settings.shipping.defaultFee || 0);
  if (settings.shipping.freeShippingEnabled && subtotal() - discount >= Number(settings.shipping.freeShippingMin || 0)) shipping = 0;
  const total = subtotal() - discount + shipping;

  async function applyCoupon() {
    setCouponMsg("");
    const res = await fetch("/api/coupons/validate", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: coupon, subtotal: subtotal(), productIds: items.map((i) => i.productId) }),
    });
    const data = await res.json();
    if (!res.ok) { setDiscount(0); return setCouponMsg(data.error); }
    setDiscount(data.discount);
    setCouponMsg(`✓ تم تطبيق خصم ${data.discount} ر.س`);
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setPlacing(true); setError("");
    const res = await fetch("/api/orders", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        customer, couponCode: coupon || undefined, paymentMethod: payment,
      }),
    });
    const data = await res.json();
    setPlacing(false);
    if (!res.ok) return setError(data.error || "فشل إنشاء الطلب");
    clear();
    setDone({ number: data.orderNumber, total: data.total });
  }

  if (done) return (
    <div className="card" style={{ maxWidth: 520, margin: "40px auto", padding: 40, textAlign: "center" }}>
      <div style={{ fontSize: 50 }}>✅</div>
      <h2 style={{ margin: "10px 0" }}>تم استلام طلبك بنجاح!</h2>
      <p>رقم الطلب: <b>{done.number}</b></p>
      <p className="price" style={{ fontSize: 20 }}>الإجمالي: {done.total} ر.س</p>
      <p style={{ fontSize: 13, color: "#64748b" }}>سنتواصل معك قريبًا لتأكيد الطلب.</p>
      <button className="btn btn-primary" onClick={() => router.push("/shop")}>مواصلة التسوق</button>
    </div>
  );

  if (items.length === 0) return (
    <div className="card" style={{ maxWidth: 480, margin: "40px auto", padding: 40, textAlign: "center" }}>
      <p>سلتك فارغة</p>
      <button className="btn btn-primary" onClick={() => router.push("/shop")}>ابدأ التسوق</button>
    </div>
  );

  const set = (k: string, v: string) => setCustomer((c) => ({ ...c, [k]: v }));

  return (
    <form onSubmit={placeOrder} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "start" }}>
      <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
        <h3 style={{ margin: 0 }}> بيانات التوصيل</h3>
        {error && <div style={{ background: "#fee2e2", color: "#b91c1c", padding: 10, borderRadius: 8, fontSize: 13 }}>{error}</div>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <input className="input" placeholder="الاسم الكامل *" required value={customer.name} onChange={(e) => set("name", e.target.value)} />
          <input className="input" placeholder="رقم الجوال *" required dir="ltr" value={customer.phone} onChange={(e) => set("phone", e.target.value)} />
          <input className="input" placeholder="البريد الإلكتروني" type="email" dir="ltr" value={customer.email} onChange={(e) => set("email", e.target.value)} />
          <select className="input" value={customer.city} onChange={(e) => set("city", e.target.value)}>
            {settings.shipping.cities.map((c: any) => <option key={c.name} value={c.name}>{c.name} ({c.duration})</option>)}
          </select>
        </div>
        <input className="input" placeholder="العنوان بالتفصيل *" required value={customer.address} onChange={(e) => set("address", e.target.value)} />
        <textarea className="input" rows={2} placeholder="ملاحظات (اختياري)" value={customer.notes} onChange={(e) => set("notes", e.target.value)} />

        <h3 style={{ margin: "8px 0 0" }}>💳 طريقة الدفع</h3>
        {enabledPayments.map(([key, p]: any) => (
          <label key={key} className="card-flat" style={{ padding: "12px 14px", display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
            <input type="radio" name="payment" checked={payment === key} onChange={() => setPayment(key)} />
            <span style={{ fontWeight: 700 }}>{p.label}</span>
          </label>
        ))}
        {payment === "bank" && settings.payments.bank.details && (
          <div style={{ background: "#fefce8", padding: 12, borderRadius: 8, fontSize: 13, whiteSpace: "pre-line" }}>
            {settings.payments.bank.details}
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 20, position: "sticky", top: 130 }}>
        <h3 style={{ margin: "0 0 14px" }}>طلبك ({items.length})</h3>
        {items.map((i) => (
          <div key={i.productId} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
            <span>{i.name} × {i.qty}</span>
            <span>{(i.price * i.qty).toLocaleString()} ر.س</span>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, margin: "14px 0" }}>
          <input className="input" dir="ltr" placeholder="كوبون خصم" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
          <button type="button" className="btn btn-outline btn-sm" onClick={applyCoupon}>تطبيق</button>
        </div>
        {couponMsg && <div style={{ fontSize: 12, marginBottom: 10, color: couponMsg.startsWith("✓") ? "#16a34a" : "#dc2626" }}>{couponMsg}</div>}
        <div style={{ fontSize: 14, lineHeight: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>المجموع الفرعي</span><span>{subtotal().toLocaleString()} ر.س</span></div>
          {discount > 0 && <div style={{ display: "flex", justifyContent: "space-between", color: "#16a34a" }}><span>الخصم</span><span>-{discount} ر.س</span></div>}
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>الشحن {shipping === 0 && "(مجاني )"}</span><span>{shipping} ر.س</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 17, borderTop: "1px solid #e2e8f0", marginTop: 6, paddingTop: 6 }}>
            <span>الإجمالي</span><span className="price">{total.toLocaleString()} ر.س</span>
          </div>
        </div>
        <button className="btn btn-primary" style={{ width: "100%", marginTop: 14 }} disabled={placing}>
          {placing ? "جارٍ إرسال الطلب..." : "تأكيد الطلب ✓"}
        </button>
      </div>
    </form>
  );
}

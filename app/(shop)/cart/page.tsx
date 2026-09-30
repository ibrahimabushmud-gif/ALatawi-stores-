"use client";
import Link from "next/link";
import { useCart } from "@/components/store/cart-store";

export default function CartPage() {
  const { items, setQty, remove, subtotal, clear } = useCart();
  return (
    <div className="container-x" style={{ paddingTop: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 20px" }}>🛒 سلة التسوق</h1>
      {items.length === 0 ? (
        <div className="card" style={{ padding: 50, textAlign: "center" }}>
          <p style={{ color: "#64748b", marginBottom: 16 }}>سلتك فارغة</p>
          <Link href="/shop" className="btn btn-primary">ابدأ التسوق</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, alignItems: "start" }}>
          <div className="card" style={{ padding: 16 }}>
            {items.map((i) => (
              <div key={i.productId} style={{ display: "flex", gap: 14, alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                <img src={i.image || "https://placehold.co/80"} width={70} height={70} style={{ borderRadius: 10, objectFit: "cover" }} alt="" />
                <div style={{ flex: 1 }}>
                  <Link href={`/product/${i.slug}`} style={{ fontWeight: 700, fontSize: 14 }}>{i.name}</Link>
                  <div className="price" style={{ marginTop: 4 }}>{i.price.toLocaleString()} ر.س</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button className="btn btn-gray btn-sm" onClick={() => setQty(i.productId, i.qty - 1)}>−</button>
                  <span style={{ fontWeight: 800, minWidth: 20, textAlign: "center" }}>{i.qty}</span>
                  <button className="btn btn-gray btn-sm" onClick={() => setQty(i.productId, i.qty + 1)}>+</button>
                </div>
                <div style={{ fontWeight: 800, minWidth: 80, textAlign: "left" }}>{(i.price * i.qty).toLocaleString()} ر.س</div>
                <button className="btn btn-danger btn-sm" onClick={() => remove(i.productId)}></button>
              </div>
            ))}
            <button className="btn btn-gray btn-sm" style={{ marginTop: 12 }} onClick={clear}>إفراغ السلة</button>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ margin: "0 0 14px" }}>ملخص الطلب</h3>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, marginBottom: 16 }}>
              <span>المجموع الفرعي</span>
              <span className="price" style={{ fontSize: 18 }}>{subtotal().toLocaleString()} ر.س</span>
            </div>
            <Link href="/checkout" className="btn btn-primary" style={{ width: "100%" }}>إتمام الشراء ←</Link>
          </div>
        </div>
      )}
    </div>
  );
}

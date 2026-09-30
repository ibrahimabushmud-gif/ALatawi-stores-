"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./cart-store";
import WishlistButton from "./WishlistButton";

export default function ProductActions({ product, colors }: { product: any; colors: string[] }) {
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(colors[0] || "");
  const add = useCart((s) => s.add);
  const router = useRouter();
  const item = {
    productId: product.id, slug: product.slug, name: product.nameAr + (color ? ` (${color})` : ""),
    price: product.price, image: product.images?.[0]?.url, stock: product.stock,
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {colors.length > 0 && (
        <div>
          <label className="label">اللون</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {colors.map((c) => (
              <button key={c} onClick={() => setColor(c)} className="btn btn-sm"
                style={c === color
                  ? { background: "var(--primary)", color: "#fff" }
                  : { background: "#f1f5f9" }}>{c}</button>
            ))}
          </div>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <label className="label" style={{ margin: 0 }}>الكمية</label>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="btn btn-gray btn-sm" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
          <span style={{ fontWeight: 800, minWidth: 24, textAlign: "center" }}>{qty}</span>
          <button className="btn btn-gray btn-sm" onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
        </div>
        <span style={{ fontSize: 13, color: product.stock > 0 ? "#16a34a" : "#dc2626" }}>
          {product.stock > 0 ? `متوفر (${product.stock})` : "نفدت الكمية"}
        </span>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-primary" style={{ flex: 1 }} disabled={product.stock <= 0}
          onClick={() => add(item, qty)}> أضف للسلة</button>
        <button className="btn btn-outline" style={{ flex: 1 }} disabled={product.stock <= 0}
          onClick={() => { add(item, qty); router.push("/checkout"); }}>⚡ اشترِ الآن</button>
        <WishlistButton big product={{ productId: product.id, slug: product.slug, name: product.nameAr, price: product.price, oldPrice: product.oldPrice, image: product.images?.[0]?.url, stock: product.stock }} />
      </div>
    </div>
  );
}

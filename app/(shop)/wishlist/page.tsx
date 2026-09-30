"use client";
import Link from "next/link";
import { useWishlist } from "@/components/store/wishlist-store";
import { useCart } from "@/components/store/cart-store";

export default function WishlistPage() {
  const { items, remove } = useWishlist();
  const add = useCart((s) => s.add);

  return (
    <div className="container-x" style={{ paddingTop: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 20px" }}>❤️ المفضلة</h1>
      {items.length === 0 ? (
        <div className="card" style={{ padding: 50, textAlign: "center" }}>
          <p style={{ color: "#64748b", marginBottom: 16 }}>لا توجد منتجات في المفضلة</p>
          <Link href="/shop" className="btn btn-primary">تصفح المنتجات</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
          {items.map((p) => (
            <div key={p.productId} className="card" style={{ padding: 12 }}>
              <Link href={`/product/${p.slug}`}>
                <img src={p.image || "https://placehold.co/300"} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 8 }} alt="" />
              </Link>
              <Link href={`/product/${p.slug}`} style={{ fontWeight: 700, display: "block", margin: "8px 0 4px", fontSize: 14 }}>{p.name}</Link>
              <div className="price" style={{ marginBottom: 10 }}>{p.price.toLocaleString()} ر.س</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }}
                  onClick={() => { add({ productId: p.productId, slug: p.slug, name: p.name, price: p.price, image: p.image, stock: p.stock }); remove(p.productId); }}>
                  نقل للسلة
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => remove(p.productId)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

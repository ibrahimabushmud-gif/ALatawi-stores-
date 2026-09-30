import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ProductGallery from "@/components/store/ProductGallery";
import ProductActions from "@/components/store/ProductActions";
import ProductCard from "@/components/store/ProductCard";
import ReviewForm from "@/components/store/ReviewForm";
import { calcDiscount } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await db.product.findUnique({ where: { slug: params.slug } });
  return { title: p?.seoTitle || p?.nameAr, description: p?.seoDescription || p?.description };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await db.product.findUnique({
    where: { slug: params.slug, status: "active" },
    include: {
      images: { orderBy: { order: "asc" } },
      category: true, brand: true,
      reviews: { where: { isApproved: true }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!product) notFound();

  const similar = await db.product.findMany({
    where: { status: "active", categoryId: product.categoryId, NOT: { id: product.id } },
    include: { images: { where: { isMain: true }, take: 1 }, brand: true },
    take: 8,
  });

  const discount = product.discount || calcDiscount(product.price, product.oldPrice);
  const colors = (product.colors as string[]) || [];
  const specs = (product.specifications as { key: string; value: string }[]) || [];

  return (
    <div className="container-x" style={{ paddingTop: 24 }}>
      <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 14 }}>
        <Link href="/">الرئيسية</Link> / {product.category && <Link href={`/shop?category=${product.category.slug}`}>{product.category.nameAr}</Link>} / {product.nameAr}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 32 }}>
        <ProductGallery images={product.images.map((i) => i.url)} name={product.nameAr} />
        <div>
          {product.brand && <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 6 }}>{product.brand.name}</div>}
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 10px" }}>{product.nameAr}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ color: "#f59e0b" }}>★★★★★</span>
            <span style={{ fontSize: 13, color: "#64748b" }}>{product.rating || "جديد"} ({product.reviews.length} تقييم)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span className="price" style={{ fontSize: 28 }}>{product.price.toLocaleString()} ر.س</span>
            {product.oldPrice && <span className="price-old" style={{ fontSize: 18 }}>{product.oldPrice.toLocaleString()} ر.س</span>}
            {discount > 0 && <span className="badge badge-discount">خصم {discount}%</span>}
          </div>
          {product.sku && <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>SKU: {product.sku}</div>}
          <ProductActions product={product} colors={colors} />
        </div>
      </div>

      <div style={{ marginTop: 36, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "start" }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ margin: "0 0 12px" }}>الوصف</h3>
          <p style={{ lineHeight: 1.9, fontSize: 14, whiteSpace: "pre-line" }}>{product.description}</p>
          {specs.length > 0 && (<>
            <h3 style={{ margin: "20px 0 12px" }}>المواصفات</h3>
            <table className="table">
              <tbody>
                {specs.map((s, i) => (
                  <tr key={i}><td style={{ fontWeight: 700, background: "#f8fafc", width: 160 }}>{s.key}</td><td>{s.value}</td></tr>
                ))}
              </tbody>
            </table>
          </>)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ margin: "0 0 12px" }}>آراء العملاء</h3>
            {product.reviews.length === 0 && <p style={{ fontSize: 13, color: "#94a3b8" }}>لا توجد تقييمات بعد</p>}
            {product.reviews.map((r) => (
              <div key={r.id} style={{ borderBottom: "1px solid #f1f5f9", padding: "10px 0" }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{r.name} <span style={{ color: "#f59e0b" }}>{"★".repeat(r.rating)}</span></div>
                {r.comment && <div style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>{r.comment}</div>}
              </div>
            ))}
          </div>
          <ReviewForm productId={product.id} />
        </div>
      </div>

      {similar.length > 0 && (<>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: "36px 0 16px" }}>منتجات مشابهة</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
          {similar.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </>)}
    </div>
  );
}

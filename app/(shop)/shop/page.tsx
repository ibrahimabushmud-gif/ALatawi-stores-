import Link from "next/link";
import { db } from "@/lib/db";
import ProductCard from "@/components/store/ProductCard";
import FiltersBar from "@/components/store/FiltersBar";

export default async function ShopPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const { q, category, brand, min, max, sort, sale, isNew, page } = searchParams;
  const where: any = { status: "active" };
  if (q) where.OR = [
    { nameAr: { contains: q, mode: "insensitive" } },
    { nameEn: { contains: q, mode: "insensitive" } },
    { tags: { contains: q, mode: "insensitive" } },
  ];
  if (category) where.category = { slug: category, isActive: true };
  if (brand) where.brandId = brand;
  if (min || max) where.price = { ...(min ? { gte: Number(min) } : {}), ...(max ? { lte: Number(max) } : {}) };
  if (sale) where.isOnSale = true;
  if (isNew) where.isNew = true;

  const orderBy: any =
    sort === "price_asc" ? { price: "asc" } :
    sort === "price_desc" ? { price: "desc" } :
    sort === "sales" ? { salesCount: "desc" } : { createdAt: "desc" };

  const pageNum = Math.max(1, Number(page) || 1);
  const [products, total, categories, brands] = await Promise.all([
    db.product.findMany({ where, orderBy, take: 24, skip: (pageNum - 1) * 24,
      include: { images: { where: { isMain: true }, take: 1 }, brand: true } }),
    db.product.count({ where }),
    db.category.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    db.brand.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / 24));
  const qs = (p: number) => {
    const params = new URLSearchParams(searchParams as any);
    params.set("page", String(p));
    return "/shop?" + params.toString();
  };

  return (
    <div className="container-x" style={{ paddingTop: 20, display: "grid", gridTemplateColumns: "250px 1fr", gap: 24 }}>
      <FiltersBar categories={categories} brands={brands} current={searchParams} />
      <div>
        <div style={{ marginBottom: 14, fontSize: 14, color: "#64748b" }}>{total} منتج</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        {products.length === 0 && (
          <div className="card" style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>لا توجد نتائج مطابقة</div>
        )}
        {totalPages > 1 && (
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24 }}>
            {pageNum > 1 && <Link href={qs(pageNum - 1)} className="btn btn-gray btn-sm">→ السابق</Link>}
            <span style={{ padding: "6px 12px" }}>{pageNum} / {totalPages}</span>
            {pageNum < totalPages && <Link href={qs(pageNum + 1)} className="btn btn-gray btn-sm">التالي ←</Link>}
          </div>
        )}
      </div>
    </div>
  );
}

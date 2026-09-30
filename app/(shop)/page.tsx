import Link from "next/link";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import Slider from "@/components/store/Slider";
import ProductCard from "@/components/store/ProductCard";

export async function generateMetadata() {
  const s = await getSettings();
  return {
    title: s.seo.siteTitle,
    description: s.seo.metaDescription,
    keywords: s.seo.keywords,
  };
}

async function getProducts(type: string, config: any) {
  const limit = config?.limit || 8;
  const where: any = { status: "active" };
  let orderBy: any = { createdAt: "desc" };
  if (type === "sale") { where.isOnSale = true; orderBy = { salesCount: "desc" }; }
  if (type === "featured") where.isFeatured = true;
  if (type === "new") where.isNew = true;
  if (type === "tag" && config?.tag) where.tags = { contains: config.tag };
  return db.product.findMany({
    where, orderBy, take: limit,
    include: { images: { where: { isMain: true }, take: 1 }, brand: true },
  });
}

const SECTION_LINKS: Record<string, string> = {
  sale: "/shop?sale=1", latest: "/shop", featured: "/shop", new: "/shop?isNew=1",
};

export default async function HomePage() {
  const sections = await db.homeSection.findMany({
    where: { isActive: true }, orderBy: { order: "asc" },
  });
  const now = new Date();
  const allBanners = await db.banner.findMany({
    where: { isActive: true }, orderBy: { order: "asc" },
  });
  const banners = allBanners.filter(
    (b) => (!b.startsAt || b.startsAt <= now) && (!b.endsAt || b.endsAt >= now)
  );
  const categories = await db.category.findMany({
    where: { isActive: true }, orderBy: { order: "asc" },
  });
  const brands = await db.brand.findMany({
    where: { isActive: true }, orderBy: { name: "asc" },
  });

  const prodTypes = ["latest", "sale", "featured", "new", "tag"];
  const pairs = await Promise.all(
    sections.filter((s) => prodTypes.includes(s.type)).map(
      async (s) => [s.id, await getProducts(s.type, s.config)] as const
    )
  );
  const prodMap = Object.fromEntries(pairs);

  return (
    <div className="container-x" style={{ paddingTop: 20, paddingBottom: 20, display: "flex", flexDirection: "column", gap: 36 }}>
      {sections.map((s) => {
        if (s.type === "slider") return <Slider key={s.id} banners={banners} />;
        if (s.type === "categories")
          return (
            <section key={s.id}>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 16px" }}>{s.title}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12 }}>
                {categories.map((c) => (
                  <Link key={c.id} href={`/shop?category=${c.slug}`} className="card"
                    style={{ padding: "18px 10px", textAlign: "center", fontWeight: 700, fontSize: 14 }}>
                    <div style={{ fontSize: 26, marginBottom: 8 }}>📱</div>
                    {c.nameAr}
                  </Link>
                ))}
              </div>
            </section>
          );
        if (s.type === "brands")
          return (
            <section key={s.id}>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 16px" }}>{s.title}</h2>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {brands.map((b) => (
                  <Link key={b.id} href={`/shop?brand=${b.id}`} className="card"
                    style={{ padding: "12px 22px", fontWeight: 700 }}>
                    {b.logo ? <img src={b.logo} alt={b.name} style={{ height: 26 }} /> : b.name}
                  </Link>
                ))}
              </div>
            </section>
          );
        if (s.type === "custom_html")
          return <section key={s.id} dangerouslySetInnerHTML={{ __html: (s.config as any)?.html || "" }} />;
        const products = prodMap[s.id] || [];
        if (!products.length) return null;
        return (
          <section key={s.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{s.title}</h2>
              <Link href={SECTION_LINKS[s.type] || "/shop"} style={{ color: "var(--primary)", fontWeight: 700, fontSize: 13 }}>
                عرض الكل ←
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
              {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}

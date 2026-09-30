import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const categories = await db.category.findMany({
    where: { isActive: true }, orderBy: { order: "asc" },
  });
  const pages = await db.page.findMany({ where: { isActive: true } });
  const t = settings.theme;
  const vars: any = {
    "--primary": t.primary, "--secondary": t.secondary, "--bg": t.bg,
    "--text": t.text, "--btn": t.btn, "--discount": t.discount,
    "--radius": t.radius + "px",
    "--font": `'${t.font}', 'Tajawal', sans-serif`,
    background: t.bg,
  };
  return (
    <div style={vars}>
      <Header store={settings.store} categories={categories} headerStyle={t.headerStyle} />
      <main style={{ minHeight: "60vh" }}>{children}</main>
      <Footer store={settings.store} categories={categories} pages={pages}
        social={settings.social} footerStyle={t.footerStyle} />
    </div>
  );
}

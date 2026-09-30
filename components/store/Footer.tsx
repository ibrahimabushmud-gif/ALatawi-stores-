import Link from 'next/link';

export default function Footer({ store, categories, pages, social, footerStyle }: any) {
  return (
    <footer className="card" style={{ padding: 30, marginTop: 40 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 30 }}>
        <div>
          <h3 style={{ marginBottom: 12 }}>{store.name}</h3>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.8 }}>
            {store.phone && <div>📞 {store.phone}</div>}
            {store.email && <div>✉️ {store.email}</div>}
            {store.address && <div>📍 {store.address}</div>}
          </p>
        </div>
        <div>
          <h4 style={{ marginBottom: 12 }}>التصنيفات</h4>
          {categories?.map((c: any) => (
            <Link key={c.id} href={`/shop?category=${c.slug}`} style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#64748b' }}>
              {c.nameAr}
            </Link>
          ))}
        </div>
        <div>
          <h4 style={{ marginBottom: 12 }}>روابط مهمة</h4>
          {pages?.map((p: any) => (
            <Link key={p.id} href={`/${p.slug}`} style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#64748b' }}>
              {p.title}
            </Link>
          ))}
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 30, paddingTop: 20, borderTop: '1px solid #e2e8f0', fontSize: 13, color: '#94a3b8' }}>
        © 2024 {store.name}. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}

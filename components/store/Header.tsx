import Link from 'next/link';

export default function Header({ store, categories, headerStyle }: any) {
  return (
    <header className="card" style={{ padding: '16px 20px', marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>
          {store?.logo ? <img src={store.logo} alt={store.name} style={{ height: 40 }} /> : store.name}
        </Link>
        <nav style={{ display: 'flex', gap: 20 }}>
          <Link href="/shop">المتجر</Link>
          <Link href="/cart"> السلة</Link>
          <Link href="/wishlist">❤️ المفضلة</Link>
          <Link href="/account">👤 حسابي</Link>
        </nav>
      </div>
    </header>
  );
}

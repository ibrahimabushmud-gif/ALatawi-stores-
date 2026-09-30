import Link from 'next/link';
import { calcDiscount } from '@/lib/utils';

export default function ProductCard({ product }: { product: any }) {
  const discount = product.discount || calcDiscount(product.price, product.oldPrice);
  const image = product.images?.[0]?.url || 'https://placehold.co/300';

  return (
    <Link href={`/product/${product.slug}`} className="card" style={{ padding: 12, textDecoration: 'none' }}>
      <div style={{ position: 'relative' }}>
        <img src={image} alt={product.nameAr} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 8 }} />
        {discount > 0 && (
          <span className="badge badge-discount" style={{ position: 'absolute', top: 8, right: 8 }}>
            -{discount}%
          </span>
        )}
      </div>
      <div style={{ marginTop: 10 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, lineHeight: 1.4 }}>{product.nameAr}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="price">{product.price.toLocaleString()} ر.س</span>
          {product.oldPrice && (
            <span className="price-old" style={{ fontSize: 12 }}>{product.oldPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

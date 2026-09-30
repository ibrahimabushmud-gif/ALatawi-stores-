"use client";
import { useWishlist } from './wishlist-store';

export default function WishlistButton({ product, big }: { product: any; big?: boolean }) {
  const { items, add, remove } = useWishlist();
  const isInWishlist = items.some((i) => i.productId === product.productId);

  return (
    <button
      className={big ? 'btn btn-outline' : 'btn btn-sm btn-outline'}
      onClick={() => isInWishlist ? remove(product.productId) : add(product)}
      style={{ background: isInWishlist ? '#fee2e2' : undefined }}
    >
      {isInWishlist ? '❤️' : '🤍'}
    </button>
  );
}

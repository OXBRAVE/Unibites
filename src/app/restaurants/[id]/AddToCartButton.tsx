"use client";

import { useCart, CartItem } from "@/components/CartProvider";

export default function AddToCartButton({ item }: { item: CartItem }) {
  const { items, addItem, decreaseItem } = useCart();
  const cartItem = items.find(i => i.id === item.id);

  if (cartItem) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <button onClick={() => decreaseItem(item.id)} className="btn btn-secondary" style={{ padding: '0.2rem 0.6rem', fontSize: '1.2rem', minWidth: '40px' }}>-</button>
        <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{cartItem.quantity}</span>
        <button onClick={() => addItem(item)} className="btn btn-primary" style={{ padding: '0.2rem 0.6rem', fontSize: '1.2rem', minWidth: '40px' }}>+</button>
      </div>
    );
  }

  return (
    <button onClick={() => addItem(item)} className="btn btn-primary">
      Add to Cart
    </button>
  );
}

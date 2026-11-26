'use client';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="stars">
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

function getDiscount(price, original) {
  if (!original || original <= price) return null;
  return Math.round(((original - price) / original) * 100);
}

export default function ProductCard({ product }) {
  const { addToCart, items, updateQty, removeFromCart } = useCart();
  const { toggle, isWished } = useWishlist();

  const cartItem = items.find(i => i.id === product.id);
  const discount = getDiscount(product.price, product.originalPrice);

  return (
    <div className="product-card">
      <div className="product-card-img-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-card-img"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80'; }}
        />
        {product.badge && (
          <span className={`product-card-badge ${product.badge === 'SALE' ? 'offer' : ''}`}>
            {product.badge}
          </span>
        )}
        {discount && !product.badge && (
          <span className="product-card-badge offer">{discount}% OFF</span>
        )}
        <div
          className="product-card-wish"
          onClick={() => toggle(product)}
          title={isWished(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isWished(product.id) ? '❤️' : '🤍'}
        </div>
      </div>

      <div className="product-card-body">
        <span className="product-card-cat">{product.category}</span>
        <Link href={`/products/${product.id}`}>
          <h3 className="product-card-name">{product.name}</h3>
        </Link>
        <span className="product-card-unit">{product.unit}</span>

        <div className="product-card-rating">
          <StarRating rating={product.rating} />
          <span className="rating-count">({product.reviews})</span>
        </div>

        <div className="product-card-price">
          <span className="price-current">₹{product.price}</span>
          {product.originalPrice > product.price && (
            <span className="price-original">₹{product.originalPrice}</span>
          )}
          {discount && <span className="price-discount">{discount}% off</span>}
        </div>

        <div className="product-card-actions">
          {cartItem ? (
            <div className="qty-control" style={{ flex: 1 }}>
              <button
                className="qty-btn"
                onClick={() => cartItem.qty === 1 ? removeFromCart(product.id) : updateQty(product.id, cartItem.qty - 1)}
              >−</button>
              <span className="qty-num">{cartItem.qty}</span>
              <button
                className="qty-btn"
                onClick={() => updateQty(product.id, cartItem.qty + 1)}
              >+</button>
            </div>
          ) : (
            <button
              className="btn btn-primary btn-sm w-full"
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

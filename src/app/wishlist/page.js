'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';

export default function WishlistPage() {
  const { items, toggle } = useWishlist();

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <div className="container"><h1>❤️ My Wishlist</h1><p>{items.length} saved items</p></div>
        </div>
        <div className="container" style={{ padding: '40px 24px' }}>
          {items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">❤️</div>
              <h3 className="empty-state-title">Your wishlist is empty</h3>
              <p className="empty-state-desc">Save your favourite products here to buy them later!</p>
              <Link href="/products" className="btn btn-primary mt-20">Browse Products</Link>
            </div>
          ) : (
            <div className="products-grid">
              {items.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand-name">🛒 Suvidha Mart</div>
          <p className="footer-brand-desc">
            Your trusted neighborhood grocery store, now at your fingertips. Fresh produce, daily essentials, and more — delivered to your door.
          </p>
          <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            {['📘', '📷', '🐦', '▶️'].map((icon, i) => (
              <div key={i} style={{
                width: 36, height: 36, background: 'rgba(255,255,255,0.15)',
                borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1rem', cursor: 'pointer',
                transition: 'var(--transition)'
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
                {icon}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="footer-title">Quick Links</p>
          <div className="footer-links">
            {[['/', 'Home'], ['/products', 'Shop Now'], ['/cart', 'Cart'], ['/orders', 'My Orders']].map(([href, label]) => (
              <Link key={href} href={href} className="footer-link">{label}</Link>
            ))}
          </div>
        </div>

        <div>
          <p className="footer-title">Categories</p>
          <div className="footer-links">
            {['Fruits & Vegetables', 'Dairy & Eggs', 'Grains & Pulses', 'Snacks', 'Spices'].map(c => (
              <Link key={c} href={`/products?category=${c.toLowerCase().split(' ')[0]}`} className="footer-link">{c}</Link>
            ))}
          </div>
        </div>

        <div>
          <p className="footer-title">Contact Us</p>
          <div className="footer-links">
            <span className="footer-link">📞 +91 98765 43210</span>
            <span className="footer-link">✉️ hello@suvidhamart.com</span>
            <span className="footer-link">📍 MG Road, Bangalore - 560001</span>
            <span className="footer-link">🕐 Mon–Sun: 8AM – 10PM</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          © 2026 Suvidha Mart. All rights reserved. Made with ❤️ for fresh groceries.
        </div>
      </div>
    </footer>
  );
}

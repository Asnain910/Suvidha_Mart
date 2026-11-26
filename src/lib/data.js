// ============================================================
// Suvidha Mart — Seed Data
// ============================================================

export const CATEGORIES = [
  { id: 'fruits', name: 'Fruits & Vegetables', icon: '🥦', color: '#4CAF50' },
  { id: 'dairy', name: 'Dairy & Eggs', icon: '🥛', color: '#03A9F4' },
  { id: 'bakery', name: 'Bakery & Bread', icon: '🍞', color: '#FF8F00' },
  { id: 'meat', name: 'Meat & Fish', icon: '🍖', color: '#E53935' },
  { id: 'snacks', name: 'Snacks & Beverages', icon: '🥤', color: '#9C27B0' },
  { id: 'grains', name: 'Grains & Pulses', icon: '🌾', color: '#795548' },
  { id: 'spices', name: 'Spices & Masala', icon: '🌶️', color: '#FF5722' },
  { id: 'frozen', name: 'Frozen Foods', icon: '🧊', color: '#00BCD4' },
  { id: 'personal', name: 'Personal Care', icon: '🧴', color: '#E91E63' },
  { id: 'household', name: 'Household', icon: '🧹', color: '#607D8B' },
];

export const PRODUCTS = [
  // Fruits & Vegetables
  { id: 'p1', name: 'Fresh Tomatoes', category: 'fruits', price: 30, originalPrice: 40, description: 'Farm-fresh red tomatoes, rich in vitamins and perfect for cooking.', image: 'https://images.unsplash.com/photo-1546094096-0df4bcabd337?w=400&q=80', stock: 100, unit: '1 kg', rating: 4.5, reviews: 128, featured: true, badge: 'Fresh' },
  { id: 'p2', name: 'Organic Bananas', category: 'fruits', price: 50, originalPrice: 60, description: 'Organically grown bananas, naturally sweet and energy-rich.', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80', stock: 80, unit: '1 dozen', rating: 4.7, reviews: 95, featured: true, badge: 'Organic' },
  { id: 'p3', name: 'Green Spinach', category: 'fruits', price: 25, originalPrice: 35, description: 'Crisp and fresh spinach leaves, packed with iron and nutrients.', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80', stock: 60, unit: '500 g', rating: 4.3, reviews: 67, featured: false, badge: null },
  { id: 'p4', name: 'Red Onions', category: 'fruits', price: 40, originalPrice: 50, description: 'Fresh red onions, essential for Indian cooking.', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80', stock: 120, unit: '1 kg', rating: 4.4, reviews: 210, featured: false, badge: null },
  { id: 'p5', name: 'Potatoes', category: 'fruits', price: 35, originalPrice: 45, description: 'Fresh potatoes, great for curries and snacks.', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80', stock: 150, unit: '2 kg', rating: 4.6, reviews: 180, featured: false, badge: 'Value Pack' },
  { id: 'p6', name: 'Cauliflower', category: 'fruits', price: 45, originalPrice: 55, description: 'Fresh white cauliflower, great for sabzi and soups.', image: 'https://images.unsplash.com/photo-1568584711271-6c929fb49b60?w=400&q=80', stock: 40, unit: '1 pc', rating: 4.2, reviews: 55, featured: false, badge: null },

  // Dairy & Eggs
  { id: 'p7', name: 'Full Cream Milk', category: 'dairy', price: 58, originalPrice: 60, description: 'Rich and creamy full-fat milk from grass-fed cows.', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80', stock: 200, unit: '1 litre', rating: 4.8, reviews: 312, featured: true, badge: 'Best Seller' },
  { id: 'p8', name: 'Farm Fresh Eggs', category: 'dairy', price: 90, originalPrice: 100, description: 'Free-range eggs from healthy hens, rich in protein.', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80', stock: 90, unit: '12 pcs', rating: 4.6, reviews: 145, featured: true, badge: 'Fresh' },
  { id: 'p9', name: 'Paneer', category: 'dairy', price: 120, originalPrice: 140, description: 'Soft and fresh homestyle paneer.', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80', stock: 55, unit: '250 g', rating: 4.7, reviews: 88, featured: false, badge: null },
  { id: 'p10', name: 'Curd / Yogurt', category: 'dairy', price: 45, originalPrice: 50, description: 'Creamy thick curd, great for raita and lassi.', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80', stock: 70, unit: '500 g', rating: 4.5, reviews: 99, featured: false, badge: null },

  // Bakery
  { id: 'p11', name: 'Whole Wheat Bread', category: 'bakery', price: 45, originalPrice: 50, description: 'Freshly baked whole wheat bread, healthy and soft.', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80', stock: 60, unit: '400 g', rating: 4.4, reviews: 73, featured: false, badge: null },
  { id: 'p12', name: 'Butter Croissant', category: 'bakery', price: 35, originalPrice: 40, description: 'Flaky, golden croissant baked fresh every morning.', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80', stock: 30, unit: '2 pcs', rating: 4.8, reviews: 62, featured: true, badge: 'New' },

  // Grains & Pulses
  { id: 'p13', name: 'Basmati Rice', category: 'grains', price: 180, originalPrice: 200, description: 'Premium long-grain basmati rice with natural aroma.', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80', stock: 100, unit: '5 kg', rating: 4.9, reviews: 430, featured: true, badge: 'Premium' },
  { id: 'p14', name: 'Toor Dal', category: 'grains', price: 130, originalPrice: 150, description: 'Pure yellow toor dal, cleaned and sorted.', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80', stock: 85, unit: '1 kg', rating: 4.5, reviews: 155, featured: false, badge: null },
  { id: 'p15', name: 'Whole Wheat Flour', category: 'grains', price: 70, originalPrice: 80, description: 'Stone-ground whole wheat atta for soft rotis.', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80', stock: 110, unit: '5 kg', rating: 4.6, reviews: 200, featured: false, badge: null },

  // Spices
  { id: 'p16', name: 'Turmeric Powder', category: 'spices', price: 55, originalPrice: 70, description: 'Pure and aromatic haldi for cooking and health.', image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80', stock: 90, unit: '200 g', rating: 4.7, reviews: 110, featured: false, badge: null },
  { id: 'p17', name: 'Garam Masala', category: 'spices', price: 80, originalPrice: 95, description: 'Freshly ground whole spice blend for rich Indian dishes.', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80', stock: 75, unit: '100 g', rating: 4.8, reviews: 90, featured: false, badge: 'Popular' },

  // Snacks & Beverages
  { id: 'p18', name: 'Maggi Noodles', category: 'snacks', price: 72, originalPrice: 80, description: 'Quick and delicious instant noodles, family pack.', image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80', stock: 200, unit: '6 pack', rating: 4.6, reviews: 520, featured: true, badge: 'Best Seller' },
  { id: 'p19', name: 'Haldirams Bhujia', category: 'snacks', price: 60, originalPrice: 75, description: 'Crispy and spicy bhujia, perfect tea-time snack.', image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&q=80', stock: 130, unit: '400 g', rating: 4.5, reviews: 280, featured: false, badge: null },
  { id: 'p20', name: 'Masala Chai', category: 'snacks', price: 150, originalPrice: 175, description: 'Premium Indian spiced tea blend for a perfect cup.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', stock: 60, unit: '250 g', rating: 4.9, reviews: 340, featured: true, badge: 'Top Rated' },

  // Personal Care
  { id: 'p21', name: 'Dove Soap Bar', category: 'personal', price: 45, originalPrice: 50, description: 'Moisturising soap with 1/4 cream for soft skin.', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80', stock: 100, unit: '3 bars', rating: 4.7, reviews: 210, featured: false, badge: null },
  { id: 'p22', name: 'Colgate Toothpaste', category: 'personal', price: 85, originalPrice: 95, description: 'Strong Teeth toothpaste for complete oral protection.', image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&q=80', stock: 80, unit: '200 g', rating: 4.6, reviews: 165, featured: false, badge: null },

  // Household
  { id: 'p23', name: 'Vim Dishwash Bar', category: 'household', price: 30, originalPrice: 35, description: 'Powerful cleaning bar for greasy utensils.', image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&q=80', stock: 120, unit: '200 g', rating: 4.4, reviews: 88, featured: false, badge: null },
  { id: 'p24', name: 'Harpic Toilet Cleaner', category: 'household', price: 90, originalPrice: 110, description: 'Powerful disinfectant for 100% germ removal.', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80', stock: 65, unit: '500 ml', rating: 4.5, reviews: 120, featured: false, badge: null },

  // Frozen
  { id: 'p25', name: 'Amul Butter', category: 'frozen', price: 55, originalPrice: 60, description: 'Rich and creamy Amul butter, perfect for toast and cooking.', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80', stock: 90, unit: '100 g', rating: 4.8, reviews: 405, featured: true, badge: 'Loved' },
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD001',
    userId: 'u1',
    customerName: 'Rahul Sharma (Demo)',
    isDemo: true,
    items: [
      { productId: 'p1', name: 'Fresh Tomatoes', price: 30, qty: 2, unit: '1 kg' },
      { productId: 'p7', name: 'Full Cream Milk', price: 58, qty: 1, unit: '1 litre' },
    ],
    total: 118,
    status: 'delivered',
    createdAt: '2026-10-28T09:30:00Z',
    address: '42, Green Park, Delhi - 110016',
    phone: '9876543210',
  },
  {
    id: 'ORD002',
    userId: 'u2',
    customerName: 'Priya Patel (Demo)',
    isDemo: true,
    items: [
      { productId: 'p13', name: 'Basmati Rice', price: 180, qty: 1, unit: '5 kg' },
      { productId: 'p18', name: 'Maggi Noodles', price: 72, qty: 2, unit: '6 pack' },
    ],
    total: 324,
    status: 'shipped',
    createdAt: '2026-10-30T14:00:00Z',
    address: '18, Lakeview Residency, Mumbai - 400051',
    phone: '9123456789',
  },
  {
    id: 'ORD003',
    userId: 'u3',
    customerName: 'Amit Verma (Demo)',
    isDemo: true,
    items: [
      { productId: 'p8', name: 'Farm Fresh Eggs', price: 90, qty: 1, unit: '12 pcs' },
      { productId: 'p25', name: 'Amul Butter', price: 55, qty: 2, unit: '100 g' },
      { productId: 'p20', name: 'Masala Chai', price: 150, qty: 1, unit: '250 g' },
    ],
    total: 350,
    status: 'processing',
    createdAt: '2026-11-01T10:15:00Z',
    address: '7, Sunrise Apartments, Bangalore - 560001',
    phone: '9988776655',
  },
  {
    id: 'ORD004',
    userId: 'u1',
    customerName: 'Rahul Sharma (Demo)',
    isDemo: true,
    items: [
      { productId: 'p2', name: 'Organic Bananas', price: 50, qty: 2, unit: '1 dozen' },
      { productId: 'p9', name: 'Paneer', price: 120, qty: 1, unit: '250 g' },
    ],
    total: 220,
    status: 'pending',
    createdAt: '2026-11-02T07:00:00Z',
    address: '42, Green Park, Delhi - 110016',
    phone: '9876543210',
  },
];

export const INITIAL_USERS = [
  { id: 'admin', name: 'Admin', email: 'admin@suvidhamart.com', password: 'admin123', role: 'admin', phone: '9000000000', avatar: 'A' },
  { id: 'u1', name: 'Rahul Sharma (Demo)', email: 'customer@suvidhamart.com', password: 'customer123', role: 'customer', phone: '9876543210', address: '42, Green Park, Delhi - 110016', avatar: 'R', isDemo: true },
  { id: 'u1-alt', name: 'Rahul Sharma (Demo)', email: 'rahul@example.com', password: 'rahul123', role: 'customer', phone: '9876543210', address: '42, Green Park, Delhi - 110016', avatar: 'R', isDemo: true },
  { id: 'u2', name: 'Priya Patel (Demo)', email: 'priya@example.com', password: 'priya123', role: 'customer', phone: '9123456789', address: '18, Lakeview Residency, Mumbai - 400051', avatar: 'P', isDemo: true },
  { id: 'u3', name: 'Amit Verma (Demo)', email: 'amit@example.com', password: 'amit123', role: 'customer', phone: '9988776655', address: '7, Sunrise Apartments, Bangalore - 560001', avatar: 'A', isDemo: true },
];

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Category from '@/models/Category';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { hashPassword } from '@/lib/auth';
import { CATEGORIES, PRODUCTS, INITIAL_ORDERS, INITIAL_USERS } from '@/lib/data';

export async function autoSeedIfEmpty() {
  try {
    const conn = await connectDB();
    if (!conn) return false;

    // 1. Ensure master admin user always exists in MongoDB
    const adminEmail = 'admin@suvidhamart.com';
    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      const hashedPassword = await hashPassword('admin123');
      await User.create({
        name: 'Suvidha Mart Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        phone: '9000000000',
        avatar: '🛡️',
        isDemo: false,
      });
      console.log('✅ Master admin user created in MongoDB');
    }

    // 2. Seed Categories if empty
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      await Category.insertMany(CATEGORIES);
      console.log('✅ Seeded default categories');
    }

    // 3. Seed Products if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(PRODUCTS);
      console.log('✅ Seeded default products');
    }

    // 4. Seed Demo Users if user collection only has admin or is empty
    const userCount = await User.countDocuments();
    if (userCount <= 1) {
      const demoCustomers = INITIAL_USERS.filter((u) => u.email !== adminEmail);
      for (const u of demoCustomers) {
        const exists = await User.findOne({ email: u.email });
        if (!exists) {
          const hashedPassword = await hashPassword(u.password);
          await User.create({
            name: u.name,
            email: u.email,
            password: hashedPassword,
            phone: u.phone || '',
            role: u.role || 'customer',
            address: u.address || '',
            avatar: u.avatar || u.name.charAt(0),
            isDemo: Boolean(u.isDemo),
          });
        }
      }
      console.log('✅ Seeded default demo customers');
    }

    // 5. Seed Demo Orders if empty
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      await Order.insertMany(INITIAL_ORDERS);
      console.log('✅ Seeded default demo orders');
    }

    return true;
  } catch (err) {
    console.error('Error during autoSeedIfEmpty:', err.message);
    return false;
  }
}

export async function POST(request) {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({
        success: false,
        offline: true,
        message: 'MongoDB is offline or not configured. Running in local fallback mode.',
      });
    }
    await autoSeedIfEmpty();
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with initial products, categories, users, and orders.',
    });
  } catch (error) {
    console.error('Seed Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to seed database' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  return POST(request);
}

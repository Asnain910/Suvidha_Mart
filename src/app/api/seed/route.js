import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Category from '@/models/Category';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { hashPassword } from '@/lib/auth';
import { CATEGORIES, PRODUCTS, INITIAL_ORDERS, INITIAL_USERS } from '@/lib/data';

export async function autoSeedIfEmpty() {
  const productCount = await Product.countDocuments();
  if (productCount > 0) return false;

  console.log('Database empty. Seeding initial data...');

  // 1. Seed Categories
  await Category.deleteMany({});
  await Category.insertMany(CATEGORIES);

  // 2. Seed Products
  await Product.deleteMany({});
  await Product.insertMany(PRODUCTS);

  // 3. Seed Users with securely hashed passwords
  await User.deleteMany({});
  const seededUsers = [];
  for (const u of INITIAL_USERS) {
    const hashedPassword = await hashPassword(u.password);
    seededUsers.push({
      ...u,
      password: hashedPassword,
    });
  }
  await User.insertMany(seededUsers);

  // 4. Seed Orders
  await Order.deleteMany({});
  await Order.insertMany(INITIAL_ORDERS);

  console.log('Database successfully seeded!');
  return true;
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

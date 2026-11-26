import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { getAuthUser } from '@/lib/auth';
import { autoSeedIfEmpty } from '@/app/api/seed/route';

export async function GET(request) {
  try {
    await connectDB();
    await autoSeedIfEmpty();

    const auth = getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const queryUserId = searchParams.get('userId');

    let filter = {};

    if (auth && auth.role === 'admin' && !queryUserId) {
      // Admin sees all orders
      filter = {};
    } else if (auth) {
      // Authenticated user sees their own orders
      filter = { userId: auth.id };
    } else if (queryUserId) {
      filter = { userId: queryUserId };
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();

    const mapped = orders.map((o) => ({
      ...o,
      id: o.id || o._id.toString(),
      _id: o._id.toString(),
    }));

    return NextResponse.json({
      success: true,
      orders: mapped,
    });
  } catch (error) {
    console.error('Get Orders Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { userId, customerName, items, total, address, phone, paymentMethod } = body;

    if (!items || !items.length || !total || !address || !phone) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required order details' },
        { status: 400 }
      );
    }

    const orderId = `ORD${Date.now().toString().slice(-6)}`;
    const newOrder = await Order.create({
      id: orderId,
      userId: userId || 'guest',
      customerName: customerName || 'Valued Customer',
      items,
      total,
      address,
      phone,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      status: 'pending',
      isDemo: false,
    });

    return NextResponse.json(
      {
        success: true,
        order: {
          ...newOrder.toObject(),
          id: newOrder.id,
          _id: newOrder._id.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create Order Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to place order' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { getAuthUser } from '@/lib/auth';
import { autoSeedIfEmpty } from '@/app/api/seed/route';

export async function GET(request) {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json(
        { success: false, error: 'Database connection offline' },
        { status: 503 }
      );
    }
    await autoSeedIfEmpty();

    const auth = getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const queryUserId = searchParams.get('userId');

    let filter = {};

    if (auth && auth.role === 'admin') {
      // Admin sees ALL orders across all devices and customers
      filter = queryUserId ? { userId: queryUserId } : {};
    } else if (auth) {
      // Logged-in customer sees only their own orders
      filter = { userId: auth.id };
    } else if (queryUserId) {
      filter = { userId: queryUserId };
    } else {
      return NextResponse.json({
        success: true,
        orders: [],
      });
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
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json(
        { success: false, error: 'Database connection offline. Order could not be saved to backend.' },
        { status: 503 }
      );
    }

    const auth = getAuthUser(request);
    const body = await request.json();
    const { userId, customerName, items, total, address, phone, paymentMethod } = body;

    if (!items || !items.length || !total || !address || !phone) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required order details' },
        { status: 400 }
      );
    }

    const resolvedUserId = auth?.id || userId || 'guest';
    const resolvedCustomerName = auth?.name || customerName || 'Valued Customer';

    const orderId = body.id || `ORD${Date.now().toString().slice(-6)}`;
    const newOrder = await Order.create({
      id: orderId,
      userId: resolvedUserId,
      customerName: resolvedCustomerName,
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

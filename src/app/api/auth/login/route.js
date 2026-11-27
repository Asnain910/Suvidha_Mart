import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, hashPassword, signToken } from '@/lib/auth';
import { autoSeedIfEmpty } from '@/app/api/seed/route';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim();

    // 1. Special Master Admin handling: Always guaranteed to work
    if (normalizedEmail === 'admin@suvidhamart.com' && cleanPassword === 'admin123') {
      let adminId = 'admin';
      let adminUser = null;

      try {
        const conn = await connectDB();
        if (conn) {
          adminUser = await User.findOne({ email: normalizedEmail });
          if (!adminUser) {
            const hashedPassword = await hashPassword('admin123');
            adminUser = await User.create({
              name: 'Suvidha Mart Admin',
              email: normalizedEmail,
              password: hashedPassword,
              role: 'admin',
              phone: '9000000000',
              avatar: '🛡️',
              isDemo: false,
            });
          }
          if (adminUser) adminId = adminUser._id.toString();
        }
      } catch (dbErr) {
        console.warn('Admin DB sync warning:', dbErr.message);
      }

      const adminPayload = {
        id: adminId,
        name: adminUser?.name || 'Suvidha Mart Admin',
        email: normalizedEmail,
        role: 'admin',
        phone: adminUser?.phone || '9000000000',
        avatar: '🛡️',
        isDemo: false,
      };

      const token = signToken(adminPayload);

      return NextResponse.json({
        success: true,
        user: adminPayload,
        token,
      });
    }

    // 2. Demo Customer quick fill handling
    if (normalizedEmail === 'customer@suvidhamart.com' && cleanPassword === 'customer123') {
      let customerId = 'u1';
      let customerUser = null;

      try {
        const conn = await connectDB();
        if (conn) {
          customerUser = await User.findOne({ email: normalizedEmail });
          if (!customerUser) {
            const hashedPassword = await hashPassword('customer123');
            customerUser = await User.create({
              name: 'Rahul Sharma (Demo)',
              email: normalizedEmail,
              password: hashedPassword,
              role: 'customer',
              phone: '9876543210',
              address: '42, Green Park, Delhi - 110016',
              avatar: 'R',
              isDemo: true,
            });
          }
          if (customerUser) customerId = customerUser._id.toString();
        }
      } catch (dbErr) {
        console.warn('Demo customer DB sync warning:', dbErr.message);
      }

      const customerPayload = {
        id: customerId,
        name: customerUser?.name || 'Rahul Sharma (Demo)',
        email: normalizedEmail,
        role: 'customer',
        phone: customerUser?.phone || '9876543210',
        address: customerUser?.address || '42, Green Park, Delhi - 110016',
        avatar: 'R',
        isDemo: true,
      };

      const token = signToken(customerPayload);

      return NextResponse.json({
        success: true,
        user: customerPayload,
        token,
      });
    }

    // 3. Regular user / database user login
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json(
        { success: false, offline: true, error: 'Database connection offline. Please check database configuration.' },
        { status: 503 }
      );
    }
    await autoSeedIfEmpty();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(cleanPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const userPayload = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
      avatar: user.avatar || user.name.charAt(0).toUpperCase(),
      isDemo: Boolean(user.isDemo),
    };

    const token = signToken(userPayload);

    return NextResponse.json({
      success: true,
      user: userPayload,
      token,
    });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server login error' },
      { status: 500 }
    );
  }
}

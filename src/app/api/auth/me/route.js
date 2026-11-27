import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const auth = getAuthUser(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No token provided or token expired' },
        { status: 401 }
      );
    }

    // Master admin session
    if (auth.role === 'admin' && (auth.id === 'admin' || auth.email === 'admin@suvidhamart.com')) {
      return NextResponse.json({
        success: true,
        user: {
          id: auth.id || 'admin',
          name: auth.name || 'Suvidha Mart Admin',
          email: 'admin@suvidhamart.com',
          role: 'admin',
          phone: auth.phone || '9000000000',
          avatar: '🛡️',
          isDemo: false,
        },
      });
    }

    await connectDB();
    let user = null;

    if (auth.id && /^[0-9a-fA-F]{24}$/.test(auth.id)) {
      user = await User.findById(auth.id).select('-password');
    }
    if (!user && auth.email) {
      user = await User.findOne({ email: auth.email.toLowerCase() }).select('-password');
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        address: user.address || '',
        avatar: user.avatar || user.name.charAt(0).toUpperCase(),
        isDemo: Boolean(user.isDemo),
      },
    });
  } catch (error) {
    console.error('Me endpoint error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

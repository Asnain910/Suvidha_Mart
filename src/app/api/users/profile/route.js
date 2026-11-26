import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function PUT(request) {
  try {
    const auth = getAuthUser(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, phone, address } = body;

    await connectDB();
    const updated = await User.findByIdAndUpdate(
      auth.id,
      {
        $set: {
          ...(name ? { name: name.trim() } : {}),
          ...(phone !== undefined ? { phone: phone.trim() } : {}),
          ...(address !== undefined ? { address: address.trim() } : {}),
        },
      },
      { new: true }
    ).select('-password');

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updated._id.toString(),
        name: updated.name,
        email: updated.email,
        role: updated.role,
        phone: updated.phone || '',
        address: updated.address || '',
        avatar: updated.avatar || updated.name.charAt(0).toUpperCase(),
      },
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

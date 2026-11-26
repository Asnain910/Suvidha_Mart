import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';
import { autoSeedIfEmpty } from '@/app/api/seed/route';

export async function GET(request) {
  try {
    const auth = getAuthUser(request);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();
    await autoSeedIfEmpty();

    const users = await User.find({}).select('-password').sort({ createdAt: -1 }).lean();

    const mapped = users.map((u) => ({
      ...u,
      id: u._id.toString(),
      _id: u._id.toString(),
    }));

    return NextResponse.json({
      success: true,
      users: mapped,
    });
  } catch (error) {
    console.error('Get Users Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import { getAuthUser } from '@/lib/auth';
import { autoSeedIfEmpty } from '@/app/api/seed/route';

export async function GET() {
  try {
    await connectDB();
    await autoSeedIfEmpty();

    const categories = await Category.find({}).sort({ name: 1 }).lean();

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error('Get Categories Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const auth = getAuthUser(request);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const id = body.id || body.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const created = await Category.create({
      ...body,
      id,
    });

    return NextResponse.json(
      {
        success: true,
        category: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create Category Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}

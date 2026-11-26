import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { getAuthUser } from '@/lib/auth';
import { autoSeedIfEmpty } from '@/app/api/seed/route';

export async function GET(request) {
  try {
    await connectDB();
    await autoSeedIfEmpty();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort');

    const query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { category: regex }, { description: regex }];
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price-asc') sortOptions = { price: 1 };
    else if (sort === 'price-desc') sortOptions = { price: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1 };
    else if (sort === 'name') sortOptions = { name: 1 };

    const products = await Product.find(query).sort(sortOptions).lean();

    // Map `_id` to `id` for backwards compatibility with existing UI
    const mapped = products.map((p) => ({
      ...p,
      id: p.id || p._id.toString(),
      _id: p._id.toString(),
    }));

    return NextResponse.json({
      success: true,
      count: mapped.length,
      products: mapped,
    });
  } catch (error) {
    console.error('Get Products Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
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

    await connectDB();
    const body = await request.json();

    const customId = body.id || `p${Date.now()}`;
    const newProduct = await Product.create({
      ...body,
      id: customId,
    });

    return NextResponse.json(
      {
        success: true,
        product: {
          ...newProduct.toObject(),
          id: newProduct.id,
          _id: newProduct._id.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create Product Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

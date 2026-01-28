import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Service from '@/models/Service';
import { requireAuth, requireRole } from '@/lib/middleware';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const providerId = searchParams.get('providerId');

    let query = {};
    if (providerId) {
      query = { providerId };
    }

    const services = await Service.find(query).populate('providerId', 'name email');

    return NextResponse.json({ services });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRole(user, ['provider', 'admin']);

    await connectDB();

    const { title, description, category, pricePerHour, duration, price } = await req.json();

    if (!title || !description || pricePerHour === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const service = await Service.create({
      title,
      description,
      category: category || 'Other',
      pricePerHour,
      price: price || pricePerHour,
      duration: duration || 60,
      providerId: user.userId,
    });

    return NextResponse.json(
      { message: 'Service created successfully', service },
      { status: 201 }
    );
  } catch (error: any) {
    const status = error.message === 'Unauthorized' || error.message === 'Invalid token' ? 401 : 
                   error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json(
      { error: error.message || 'Failed to create service' },
      { status }
    );
  }
}

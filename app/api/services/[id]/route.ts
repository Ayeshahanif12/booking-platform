import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Service from '@/models/Service';
import { requireAuth, requireRole } from '@/lib/middleware';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const service = await Service.findById(params.id).populate('providerId', 'name email');

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ service });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch service' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = requireAuth(req);
    await connectDB();

    const service = await Service.findById(params.id);
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    if (service.providerId.toString() !== user.userId && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { title, description, price } = await req.json();

    if (title) service.title = title;
    if (description) service.description = description;
    if (price !== undefined) service.price = price;

    await service.save();

    return NextResponse.json({
      message: 'Service updated successfully',
      service,
    });
  } catch (error: any) {
    const status = error.message === 'Unauthorized' || error.message === 'Invalid token' ? 401 : 
                   error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json(
      { error: error.message || 'Failed to update service' },
      { status }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = requireAuth(req);
    await connectDB();

    const service = await Service.findById(params.id);
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    if (service.providerId.toString() !== user.userId && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await Service.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: 'Service deleted successfully',
    });
  } catch (error: any) {
    const status = error.message === 'Unauthorized' || error.message === 'Invalid token' ? 401 : 
                   error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json(
      { error: error.message || 'Failed to delete service' },
      { status }
    );
  }
}

import connectDB from '@/lib/db';
import User from '@/models/User';
import Service from '@/models/Service';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

interface DecodedToken {
  userId: string;
  role: string;
}

// GET all services with provider details
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    ) as DecodedToken;

    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Get all services with provider info
    const services = await Service.find()
      .populate('providerId', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      services,
      total: services.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// DELETE a service (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    ) as DecodedToken;

    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const { serviceId } = await request.json();

    if (!serviceId) {
      return NextResponse.json(
        { error: 'Service ID required' },
        { status: 400 }
      );
    }

    const service = await Service.findByIdAndDelete(serviceId);

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Service deleted successfully',
      service: service,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete service' },
      { status: 500 }
    );
  }
}

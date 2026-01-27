import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import Service from '@/models/Service';
import { requireAuth } from '@/lib/middleware';

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const providerId = searchParams.get('providerId');

    let query: any = {};

    if (user.role === 'user') {
      query.userId = user.userId;
    } else if (user.role === 'provider') {
      const services = await Service.find({ providerId: user.userId });
      const serviceIds = services.map(s => s._id);
      query.serviceId = { $in: serviceIds };
    } else if (user.role === 'admin') {
      if (providerId) {
        const services = await Service.find({ providerId });
        const serviceIds = services.map(s => s._id);
        query.serviceId = { $in: serviceIds };
      }
    }

    const bookings = await Booking.find(query)
      .populate('userId', 'name email')
      .populate({
        path: 'serviceId',
        populate: { path: 'providerId', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ bookings });
  } catch (error: any) {
    const status = error.message === 'Unauthorized' || error.message === 'Invalid token' ? 401 : 500;
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bookings' },
      { status }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    await connectDB();

    const { serviceId, date, time } = await req.json();

    if (!serviceId || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    const booking = await Booking.create({
      userId: user.userId,
      serviceId,
      date: new Date(date),
      time,
      status: 'pending',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('userId', 'name email')
      .populate('serviceId');

    return NextResponse.json(
      { message: 'Booking created successfully', booking: populatedBooking },
      { status: 201 }
    );
  } catch (error: any) {
    const status = error.message === 'Unauthorized' || error.message === 'Invalid token' ? 401 : 500;
    return NextResponse.json(
      { error: error.message || 'Failed to create booking' },
      { status }
    );
  }
}

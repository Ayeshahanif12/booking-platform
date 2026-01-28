import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import Service from '@/models/Service';
import User from '@/models/User';
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
      query.providerId = user.userId;
    } else if (user.role === 'admin') {
      if (providerId) {
        query.providerId = providerId;
      }
    }

    const bookings = await Booking.find(query)
      .populate('userId', 'name email')
      .populate('providerId', 'name email')
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

    const { serviceId, serviceName, category, date, time, duration, totalPrice, description } = await req.json();

    if (!serviceName || !date || !time || totalPrice === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const bookingDate = new Date(date);
    if (bookingDate < new Date()) {
      return NextResponse.json(
        { error: 'Cannot book for past dates' },
        { status: 400 }
      );
    }

    let service = null;
    let providerId = null;

    if (serviceId) {
      service = await Service.findById(serviceId);
      if (!service) {
        return NextResponse.json(
          { error: 'Service not found' },
          { status: 404 }
        );
      }
      providerId = service.providerId;
      
      if (!service.available) {
        return NextResponse.json(
          { error: 'Service is not available' },
          { status: 400 }
        );
      }
    }

    const booking = await Booking.create({
      userId: user.userId,
      providerId: providerId,
      serviceId: serviceId || null,
      serviceName,
      category: category || 'Other',
      date: bookingDate,
      time,
      duration: duration || 60,
      totalPrice,
      description: description || '',
      status: 'pending',
      paymentStatus: 'pending',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('userId', 'name email')
      .populate('providerId', 'name email')
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

export async function PUT(req: NextRequest) {
  try {
    const user = requireAuth(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get('id');
    const { status, rating, review } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    if (booking.userId.toString() !== user.userId && booking.providerId?.toString() !== user.userId) {
      return NextResponse.json(
        { error: 'Not authorized to update this booking' },
        { status: 403 }
      );
    }

    if (status) {
      if (['pending', 'accepted', 'rejected', 'completed', 'cancelled'].includes(status)) {
        booking.status = status;
      }
    }

    if (rating) {
      booking.rating = Math.min(5, Math.max(1, rating));
    }

    if (review) {
      booking.review = review;
    }

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('userId', 'name email')
      .populate('providerId', 'name email')
      .populate('serviceId');

    return NextResponse.json({
      message: 'Booking updated successfully',
      booking: updatedBooking,
    });
  } catch (error: any) {
    const status = error.message === 'Unauthorized' || error.message === 'Invalid token' ? 401 : 500;
    return NextResponse.json(
      { error: error.message || 'Failed to update booking' },
      { status }
    );
  }
}

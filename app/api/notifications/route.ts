import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import { requireAuth } from '@/lib/middleware';

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const since = searchParams.get('since');
    const sinceDate = since ? new Date(since) : new Date(0);

    let bookings = [];

    if (user.role === 'provider') {
      bookings = await Booking.find({
        providerId: user.userId,
        createdAt: { $gte: sinceDate },
        status: 'pending',
      })
        .sort({ createdAt: -1 })
        .limit(10);
    } else {
      bookings = await Booking.find({
        userId: user.userId,
        updatedAt: { $gte: sinceDate },
        status: { $in: ['accepted', 'rejected', 'completed', 'cancelled'] },
      })
        .sort({ updatedAt: -1 })
        .limit(10);
    }

    const notifications = bookings.map((booking: any) => ({
      id: booking._id.toString(),
      title:
        user.role === 'provider'
          ? 'New booking request'
          : `Booking ${booking.status}`,
      message:
        user.role === 'provider'
          ? `Service: ${booking.serviceName}`
          : `Service: ${booking.serviceName}`,
      createdAt: user.role === 'provider' ? booking.createdAt : booking.updatedAt,
      link: user.role === 'provider' ? '/provider/bookings' : '/bookings',
    }));

    return NextResponse.json({ notifications });
  } catch (error: any) {
    const status = error.message === 'Unauthorized' || error.message === 'Invalid token' ? 401 : 500;
    return NextResponse.json(
      { error: error.message || 'Failed to fetch notifications' },
      { status }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import Service from '@/models/Service';
import { requireAuth } from '@/lib/middleware';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = requireAuth(req);
    await connectDB();

    const booking = await Booking.findById(params.id).populate('serviceId');
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const { status } = await req.json();

    if (user.role === 'provider') {
      const service = await Service.findById(booking.serviceId);
      if (service.providerId.toString() !== user.userId) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }

      if (!['accepted', 'rejected'].includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status for provider' },
          { status: 400 }
        );
      }
    } else if (user.role === 'user') {
      if (booking.userId.toString() !== user.userId) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }
    } else if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    booking.status = status;
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('userId', 'name email')
      .populate('serviceId');

    return NextResponse.json({
      message: 'Booking updated successfully',
      booking: updatedBooking,
    });
  } catch (error: any) {
    const status = error.message === 'Unauthorized' || error.message === 'Invalid token' ? 401 : 
                   error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json(
      { error: error.message || 'Failed to update booking' },
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

    const booking = await Booking.findById(params.id);
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    if (booking.userId.toString() !== user.userId && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await Booking.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: 'Booking deleted successfully',
    });
  } catch (error: any) {
    const status = error.message === 'Unauthorized' || error.message === 'Invalid token' ? 401 : 
                   error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json(
      { error: error.message || 'Failed to delete booking' },
      { status }
    );
  }
}

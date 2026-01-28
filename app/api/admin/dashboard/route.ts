import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Service from '@/models/Service';
import Booking from '@/models/Booking';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

interface DecodedToken {
  userId: string;
  role: string;
}

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

    // Get statistics
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProviders = await User.countDocuments({ role: 'provider' });
    const totalServices = await Service.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const totalRevenue = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    return NextResponse.json({
      statistics: {
        totalUsers,
        totalProviders,
        totalServices,
        totalBookings,
        completedBookings,
        pendingBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

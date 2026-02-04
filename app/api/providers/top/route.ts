import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Service from '@/models/Service';
import Booking from '@/models/Booking';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '6', 10), 12);

    const providers = await User.find({ role: 'provider' })
      .select('name email averageRating totalBookings createdAt verified')
      .sort({ averageRating: -1, totalBookings: -1 })
      .limit(limit);

    const providersWithStats = await Promise.all(
      providers.map(async (provider) => {
        const totalServices = await Service.countDocuments({ providerId: provider._id });
        const totalBookings = await Booking.countDocuments({ providerId: provider._id });
        const completedBookings = await Booking.countDocuments({
          providerId: provider._id,
          status: 'completed',
        });
        const respondedBookings = await Booking.countDocuments({
          providerId: provider._id,
          status: { $in: ['accepted', 'rejected', 'completed'] },
        });

        return {
          ...provider.toObject(),
          totalServices,
          totalBookings,
          completedBookings,
          responseRate: totalBookings > 0 ? Math.round((respondedBookings / totalBookings) * 100) : 0,
        };
      })
    );

    return NextResponse.json({ providers: providersWithStats });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch top providers' },
      { status: 500 }
    );
  }
}

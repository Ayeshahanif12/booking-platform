import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Service from '@/models/Service';
import Booking from '@/models/Booking';

export async function GET(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectDB();

    const providerId = context.params.id;
    if (!providerId) {
      return NextResponse.json({ error: 'Provider ID is required' }, { status: 400 });
    }

    const provider = await User.findOne({ _id: providerId, role: 'provider' }).select(
      'name email averageRating createdAt updatedAt totalBookings verified'
    );

    if (!provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    const services = await Service.find({ providerId }).sort({ createdAt: -1 });

    const totalBookings = await Booking.countDocuments({ providerId });
    const completedBookings = await Booking.countDocuments({ providerId, status: 'completed' });
    const respondedBookings = await Booking.countDocuments({
      providerId,
      status: { $in: ['accepted', 'rejected', 'completed'] },
    });

    const reviews = await Booking.find({
      providerId,
      status: 'completed',
      $or: [{ rating: { $exists: true } }, { review: { $exists: true, $ne: '' } }],
    })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(20);

    const ratingValues = reviews
      .map((review) => review.rating)
      .filter((value) => typeof value === 'number') as number[];

    const averageRating =
      ratingValues.length > 0
        ? Math.round((ratingValues.reduce((sum, value) => sum + value, 0) / ratingValues.length) * 10) / 10
        : provider.averageRating || 0;

    return NextResponse.json({
      provider,
      services,
      reviews,
      stats: {
        totalServices: services.length,
        totalReviews: reviews.length,
        totalBookings,
        completedBookings,
        responseRate: totalBookings > 0 ? Math.round((respondedBookings / totalBookings) * 100) : 0,
        averageRating,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch provider profile' },
      { status: 500 }
    );
  }
}

import connectDB from '@/lib/db';
import User from '@/models/User';
import Service from '@/models/Service';
import Booking from '@/models/Booking';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import logAudit from '@/lib/audit';

interface DecodedToken {
  userId: string;
  role: string;
}

// GET all providers with their services and stats
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

    // Get all providers
    const providers = await User.find({ role: 'provider' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Enrich providers with their services and stats
    const providersWithStats = await Promise.all(
      providers.map(async (provider) => {
        const services = await Service.find({ providerId: provider._id });
        const bookings = await Booking.find({ providerId: provider._id });
        const completedBookings = await Booking.countDocuments({
          providerId: provider._id,
          status: 'completed',
        });

        return {
          ...provider.toObject(),
          totalServices: services.length,
          totalBookings: bookings.length,
          completedBookings,
          totalEarnings: provider.totalEarnings || 0,
          averageRating: provider.averageRating || 0,
        };
      })
    );

    return NextResponse.json({
      providers: providersWithStats,
      total: providersWithStats.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch providers' },
      { status: 500 }
    );
  }
}

// DELETE a provider (Admin only)
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

    const { providerId } = await request.json();

    if (!providerId) {
      return NextResponse.json(
        { error: 'Provider ID required' },
        { status: 400 }
      );
    }

    // Check if provider exists
    const provider = await User.findById(providerId);
    if (!provider || provider.role !== 'provider') {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    // Delete all services
    const servicesDeleted = await Service.deleteMany({ providerId });

    // Delete all bookings
    const bookingsDeleted = await Booking.deleteMany({ providerId });

    // Delete provider
    await User.findByIdAndDelete(providerId);

    // Audit log
    try {
      await logAudit({ actorId: user._id, actorEmail: user.email, action: 'delete_provider', resourceType: 'User', resourceId: providerId, details: { servicesDeleted: servicesDeleted.deletedCount, bookingsDeleted: bookingsDeleted.deletedCount } });
    } catch (err) {
      console.error('Audit log failed', err);
    }

    return NextResponse.json({
      message: 'Provider and all related data deleted',
      deletedData: {
        provider: provider.name,
        servicesCount: servicesDeleted.deletedCount,
        bookingsCount: bookingsDeleted.deletedCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete provider' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { requireAuth, requireRole } from '@/lib/middleware';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = requireAuth(req);
    requireRole(user, ['admin']);

    await connectDB();

    const targetUser = await User.findById(params.id);
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { isBlocked } = await req.json();

    targetUser.isBlocked = isBlocked;
    await targetUser.save();

    return NextResponse.json({
      message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user: {
        id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        isBlocked: targetUser.isBlocked,
      },
    });
  } catch (error: any) {
    const status = error.message === 'Unauthorized' || error.message === 'Invalid token' ? 401 : 
                   error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status }
    );
  }
}

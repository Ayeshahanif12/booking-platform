import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { requireAuth, requireRole } from '@/lib/middleware';

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRole(user, ['admin']);

    await connectDB();

    const users = await User.find().select('-password').sort({ createdAt: -1 });

    return NextResponse.json({ users });
  } catch (error: any) {
    const status = error.message === 'Unauthorized' || error.message === 'Invalid token' ? 401 : 
                   error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status }
    );
  }
}

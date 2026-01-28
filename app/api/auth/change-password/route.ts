import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { requireAuth } from '@/lib/middleware';

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    await connectDB();

    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Old and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const userDoc = await User.findById(user.userId);
    if (!userDoc) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, userDoc.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    userDoc.password = hashedPassword;
    await userDoc.save();

    return NextResponse.json({
      message: 'Password changed successfully',
    });
  } catch (error: any) {
    const status = error.message === 'Unauthorized' || error.message === 'Invalid token' ? 401 : 500;
    return NextResponse.json(
      { error: error.message || 'Failed to change password' },
      { status }
    );
  }
}

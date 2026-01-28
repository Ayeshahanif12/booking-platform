import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (user.blocked) {
      return NextResponse.json(
        { error: 'Account is blocked' },
        { status: 403 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}

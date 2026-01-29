import connectDB from '@/lib/db';
import User from '@/models/User';
import Service from '@/models/Service';
import Booking from '@/models/Booking';
import bcrypt from 'bcryptjs';

// This script creates an admin user in the database
// Run this ONCE to set up the initial admin

export async function POST(req: any) {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@bookingplatform.com' });
    if (existingAdmin) {
      return Response.json(
        { message: 'Admin already exists', admin: { email: existingAdmin.email, role: existingAdmin.role } },
        { status: 200 }
      );
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin@12345', 10);
    const adminUser = new User({
      name: 'Platform Admin',
      email: 'admin@bookingplatform.com',
      password: hashedPassword,
      role: 'admin',
      verified: true,
    });

    await adminUser.save();

    return Response.json(
      {
        message: 'Admin created successfully',
        admin: {
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
          credentials: {
            email: 'admin@bookingplatform.com',
            password: 'Admin@12345',
          },
          note: '⚠️ SAVE THESE CREDENTIALS SAFELY. Change password after first login!',
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Failed to create admin' },
      { status: 500 }
    );
  }
}

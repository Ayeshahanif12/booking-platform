/* Seed script: creates admin, sample provider, user, service and booking */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Define schemas inline to avoid TypeScript import issues
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'provider', 'admin'], default: 'user' },
  blocked: { type: Boolean, default: false },
  blockReason: String,
  totalEarnings: { type: Number, default: 0 },
  totalBookings: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Cleaning', 'Repair', 'Tutoring', 'Photography', 'Plumbing', 'Electrical', 'Gardening', 'Cooking', 'Music', 'Fitness', 'Other'], default: 'Other' },
  pricePerHour: { type: Number, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, default: 60 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  available: { type: Boolean, default: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  serviceName: { type: String, required: true },
  category: { type: String, default: 'Other' },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: Number, default: 60 },
  totalPrice: { type: Number, required: true },
  description: String,
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  rating: { type: Number, min: 1, max: 5 },
  review: String,
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cancellationReason: String,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Service = mongoose.model('Service', serviceSchema);
const Booking = mongoose.model('Booking', bookingSchema);

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');
  
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 });
    console.log('✓ Connected to DB');

    // Create admin
    const adminEmail = 'admin@bookingplatform.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const hashed = await bcrypt.hash('Admin@12345', 10);
      admin = await User.create({ name: 'Platform Admin', email: adminEmail, password: hashed, role: 'admin', verified: true });
      console.log('✓ Admin created');
    } else {
      console.log('✓ Admin exists');
    }

    // Create provider
    let provider = await User.findOne({ email: 'provider@example.com' });
    if (!provider) {
      const hashed = await bcrypt.hash('Provider@123', 10);
      provider = await User.create({ name: 'Sample Provider', email: 'provider@example.com', password: hashed, role: 'provider', verified: true });
      console.log('✓ Provider created');
    } else {
      console.log('✓ Provider exists');
    }

    // Create user
    let user = await User.findOne({ email: 'user@example.com' });
    if (!user) {
      const hashed = await bcrypt.hash('User@123', 10);
      user = await User.create({ name: 'Sample User', email: 'user@example.com', password: hashed, role: 'user', verified: true });
      console.log('✓ User created');
    } else {
      console.log('✓ User exists');
    }

    // Create a service
    let service = await Service.findOne({ title: 'Sample Cleaning' });
    if (!service) {
      service = await Service.create({ title: 'Sample Cleaning', description: 'A sample cleaning service', category: 'Cleaning', pricePerHour: 500, price: 500, duration: 60, providerId: provider._id });
      console.log('✓ Service created');
    } else {
      console.log('✓ Service exists');
    }

    // Create booking
    let booking = await Booking.findOne({ serviceName: service.title, userId: user._id });
    if (!booking) {
      booking = await Booking.create({ userId: user._id, providerId: provider._id, serviceId: service._id, serviceName: service.title, date: new Date(), time: '10:00', totalPrice: service.price, status: 'pending', paymentStatus: 'pending' });
      console.log('✓ Booking created');
    } else {
      console.log('✓ Booking exists');
    }

    console.log('\n✓✓✓ Seeding complete ✓✓✓\n');
    console.log('Test Credentials:');
    console.log('  Admin: admin@bookingplatform.com / Admin@12345');
    console.log('  Provider: provider@example.com / Provider@123');
    console.log('  User: user@example.com / User@123');
    
    await mongoose.connection.close();
  } catch (err) {
    console.error('✗ Seed error:', err.message);
    process.exit(1);
  }
}

run();

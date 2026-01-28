/* Seed script: creates admin, sample provider, user, service and booking */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User').default || require('../models/User');
const Service = require('../models/Service').default || require('../models/Service');
const Booking = require('../models/Booking').default || require('../models/Booking');

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');
  await mongoose.connect(uri);
  console.log('Connected to DB');

  // Create admin
  const adminEmail = 'admin@bookingplatform.com';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const hashed = await bcrypt.hash('Admin@12345', 10);
    admin = await User.create({ name: 'Platform Admin', email: adminEmail, password: hashed, role: 'admin', verified: true });
    console.log('Admin created');
  } else {
    console.log('Admin exists');
  }

  // Create provider
  let provider = await User.findOne({ email: 'provider@example.com' });
  if (!provider) {
    const hashed = await bcrypt.hash('Provider@123', 10);
    provider = await User.create({ name: 'Sample Provider', email: 'provider@example.com', password: hashed, role: 'provider', verified: true });
    console.log('Provider created');
  }

  // Create user
  let user = await User.findOne({ email: 'user@example.com' });
  if (!user) {
    const hashed = await bcrypt.hash('User@123', 10);
    user = await User.create({ name: 'Sample User', email: 'user@example.com', password: hashed, role: 'user', verified: true });
    console.log('User created');
  }

  // Create a service
  let service = await Service.findOne({ title: 'Sample Cleaning' });
  if (!service) {
    service = await Service.create({ title: 'Sample Cleaning', description: 'A sample cleaning service', category: 'Cleaning', pricePerHour: 500, price: 500, duration: 60, providerId: provider._id });
    console.log('Service created');
  }

  // Create booking
  let booking = await Booking.findOne({ serviceName: service.title, userId: user._id });
  if (!booking) {
    booking = await Booking.create({ userId: user._id, providerId: provider._id, serviceId: service._id, serviceName: service.title, date: new Date(), time: '10:00', totalPrice: service.price, status: 'pending', paymentStatus: 'pending' });
    console.log('Booking created');
  }

  console.log('Seeding complete');
  await mongoose.connection.close();
}

run().catch((err) => { console.error(err); process.exit(1); });

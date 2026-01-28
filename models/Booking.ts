import mongoose, { Schema, models } from 'mongoose';

const bookingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  providerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
  },
  serviceName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'Other',
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 60, // minutes
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
  },
  cancelledBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  cancellationReason: {
    type: String,
  },
}, {
  timestamps: true,
});

const Booking = models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;

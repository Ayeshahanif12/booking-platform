import mongoose, { Schema, models } from 'mongoose';

const serviceSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Cleaning', 'Repair', 'Tutoring', 'Photography', 'Plumbing', 'Electrical', 'Gardening', 'Cooking', 'Music', 'Fitness', 'Other'],
    default: 'Other',
  },
  pricePerHour: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    default: 60, // minutes
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  available: {
    type: Boolean,
    default: true,
  },
  providerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

const Service = models.Service || mongoose.model('Service', serviceSchema);

export default Service;

import mongoose, { Schema, models } from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'provider', 'admin'],
    default: 'user',
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  blockReason: {
    type: String,
  },
  totalEarnings: {
    type: Number,
    default: 0,
  },
  totalBookings: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  verified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const User = models.User || mongoose.model('User', userSchema);

export default User;

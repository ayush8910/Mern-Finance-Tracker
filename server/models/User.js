import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  otp: {
    code: String,
    expiresAt: Date
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);

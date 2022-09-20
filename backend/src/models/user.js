import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  rooms: {
    type: [mongoose.ObjectId],
    required: true,
    default: [],
  },
});

export default mongoose.model('User', userSchema);

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
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
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default mongoose.model('User', userSchema);

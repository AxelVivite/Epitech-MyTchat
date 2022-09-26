import mongoose from 'mongoose';

// todo: maybe deletedUser field is not necessary
const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  users: {
    type: [mongoose.ObjectId],
    required: true,
  },
  deletedUsers: {
    type: [mongoose.ObjectId],
    required: true,
    default: [],
  },
  posts: {
    type: [mongoose.ObjectId],
    required: true,
    default: [],
  },
});

export default mongoose.model('Room', roomSchema);

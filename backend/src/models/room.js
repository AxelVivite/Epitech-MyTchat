import mongoose from 'mongoose'

const roomSchema = new mongoose.Schema({
  users: {
    type: [mongoose.ObjectId],
    required: true,
  },
  posts: {
    type: [mongoose.ObjectId],
    required: true,
    default: []
  }
})

export default mongoose.model('Room', roomSchema)

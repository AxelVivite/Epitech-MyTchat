import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
   user: {
    type: mongoose.ObjectId,
    required: true,
  },
  content: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
})

export default mongoose.model('Post', postSchema)

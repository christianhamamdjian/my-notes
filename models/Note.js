import mongoose from 'mongoose'

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide title'],
      maxlength: 50,
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['action', 'urgent', 'todo'],
      default: 'todo',
    },
    category: {
      type: String,
      enum: ['info', 'reminder', 'note', 'fun'],
      default: 'info',
    },
    noteLocation: {
      type: String,
      default: 'my desk',
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
)

export default mongoose.model('Note', NoteSchema)
